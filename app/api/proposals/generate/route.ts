import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { title, description, deliverables, tone, industry, language, clientName } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Construct the system prompt
    const systemPrompt = `You are an expert ${industry || 'business'} proposal writer.
Write a compelling, professional proposal in ${language === 'de' ? 'German' : 'English'} language.
Use a ${tone || 'professional'} tone.
Focus on client benefits, clear deliverables, and persuasive language.
Format the output as a structured proposal with clear sections.`;

    // Construct the user prompt
    const userPrompt = `Create a detailed business proposal with the following information:

Project Title: ${title}

Project Description:
${description}

${deliverables && deliverables.length > 0 ? `
Deliverables:
${deliverables.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')}
` : ''}

${clientName ? `Client Name: ${clientName}` : ''}

Please generate a comprehensive proposal including:
1. Executive Summary (compelling overview)
2. Project Overview (detailed scope)
3. Deliverables Breakdown (what they'll receive)
4. Timeline & Milestones (project phases)
5. Why Choose Us (our value proposition)
6. Next Steps (clear call to action)

Make it persuasive, professional, and tailored to the client's needs.`;

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a mock proposal if API key is not set
      return NextResponse.json({
        content: `# ${title}

## Executive Summary

We are excited to present this proposal for **${title}**. Our team brings extensive experience in ${industry || 'delivering exceptional results'}, and we're committed to exceeding your expectations.

## Project Overview

${description}

## Deliverables

${deliverables && deliverables.length > 0
  ? deliverables.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')
  : 'We will deliver a comprehensive solution tailored to your specific needs.'}

## Timeline & Milestones

- **Week 1-2**: Project kickoff and requirements gathering
- **Week 3-4**: Design and development phase
- **Week 5-6**: Testing and refinements
- **Week 7**: Final delivery and training

## Why Choose Us

- Proven track record of successful projects
- Dedicated team of experienced professionals
- Transparent communication throughout the project
- Commitment to quality and client satisfaction

## Next Steps

We're ready to begin as soon as you give us the green light. Please review this proposal and let us know if you have any questions or would like to discuss any aspect in more detail.

We look forward to working with you!

---

*Note: This is a template proposal. Configure your Anthropic API key to generate AI-powered, customized proposals.*`,
        isTemplate: true,
      });
    }

    // Generate proposal using Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract text content from the response
    const content = message.content
      .filter((block) => block.type === 'text')
      .map((block: { type: 'text'; text: string }) => block.text)
      .join('\n\n');

    return NextResponse.json({
      content,
      isTemplate: false,
    });
  } catch (error) {
    console.error('Error generating proposal:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate proposal';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
