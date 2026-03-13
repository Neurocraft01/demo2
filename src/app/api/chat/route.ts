import { NextResponse } from 'next/server';
import { getAllSiteContent } from '@/lib/content';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const siteData = await getAllSiteContent();

        // Optional: Replace API_KEY logic. If you add OPENAI_API_KEY to your .env, it uses GPT.
        const openAiKey = process.env.OPENAI_API_KEY;

        const systemPrompt = `You are the AKS Automations assistant. 
        You help visitors understand our services, projects, and agency details based on this website data:
        ${JSON.stringify(siteData)}
        
        Keep your answers concise, friendly, and professional. 
        If the user asks something outside the provided context, politely inform them that you can mainly help with AKS Automations related inquiries.`;

        if (openAiKey) {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openAiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...messages
                    ],
                    temperature: 0.7,
                    max_tokens: 300,
                }),
            });

            const data = await response.json();
            return NextResponse.json({ reply: data.choices[0].message.content });
        }

        // ─── OFFLINE KEYWORD FALLBACK (If no OpenAI Key is provided) ───
        const lastMsg = messages[messages.length - 1].content.toLowerCase();
        let reply = "Thanks for your message! To enable full AI capabilities, please add an OPENAI_API_KEY to the server. ";

        // Use the dynamically fetched siteData to make offline responses smarter
        const projectsData = (siteData.projects as any)?.PROJECTS || [];
        const servicesData = (siteData.services as any)?.SERVICES || [];
        
        if (lastMsg.includes('service') || lastMsg.includes('do you do') || lastMsg.includes('offer')) {
            const serviceNames = servicesData.map((s: any) => s.title).join(', ');
            reply = `We provide a variety of services including: ${serviceNames || 'Web Development, AI Automations, and Data Engineering'}. How can we help?`;
        } else if (lastMsg.includes('contact') || lastMsg.includes('reach')) {
            reply = `You can reach us through our contact page or book a Calendly call on our site!`;
        } else if (lastMsg.includes('project') || lastMsg.includes('portfolio') || lastMsg.includes('built')) {
            const projectNames = projectsData.slice(0, 3).map((p: any) => p.title).join(', ');
            reply = `We've built numerous platforms! Some recent ones include: ${projectNames || 'corporate portfolios and automation bots'}. Check out our Projects page for more!`;
        } else {
            reply = `I am currently in offline mode (no API key). You can ask me about our "services", "projects", or "contact" info!`;
        }

        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));

        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Chatbot API Error:', error);
        return NextResponse.json({ reply: "I'm having a little trouble connecting right now. Please try again!" }, { status: 500 });
    }
}
