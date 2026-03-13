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
        let reply = "";

        // Use the dynamically fetched siteData to make offline responses smarter
        const projectsData = (siteData.projects as any)?.PROJECTS || [];
        const servicesData = (siteData.services as any)?.SERVICES || [];
        
        if (lastMsg.includes('hi') || lastMsg.includes('hello') || lastMsg.includes('hey')) {
            reply = `Hello there! I'm the AKS assistant. I can help you with information about our Services, Projects, or help you get in touch with our team. What can I assist you with today?`;
        } else if (lastMsg.includes('service') || lastMsg.includes('do you do') || lastMsg.includes('offer')) {
            const serviceNames = servicesData.map((s: any) => s.title).join(', ');
            reply = `We provide a variety of top-tier services including: ${serviceNames || 'Web Development, AI Automations, and Data Engineering'}. Would you like more details on any of these?`;
        } else if (lastMsg.includes('contact') || lastMsg.includes('reach') || lastMsg.includes('email') || lastMsg.includes('call')) {
            reply = `You can easily reach us by filling out the form on our Contact page, or you can book a free consultation call directly via our Calendly link on the site!`;
        } else if (lastMsg.includes('project') || lastMsg.includes('portfolio') || lastMsg.includes('built') || lastMsg.includes('work')) {
            const projectNames = projectsData.slice(0, 3).map((p: any) => p.title).join(', ');
            reply = `We've built numerous platforms for clients worldwide! Some of our recent favorites include: ${projectNames || 'corporate portfolios and robust automation bots'}. Feel free to check out our Projects page for detailed case studies.`;
        } else if (lastMsg.includes('price') || lastMsg.includes('cost') || lastMsg.includes('quote')) {
            reply = `Our pricing is custom-tailored to the specific needs and scale of your project. We'd love to give you an accurate quote! Please fill out our contact form or book a quick call with our team so we can discuss the details.`;
        } else {
            reply = `That's a great question! However, I am a specialized virtual assistant and might not have the full context for that. \n\nOur human support team would be happy to help you—please feel free to fill out the contact form on our website or book a direct call with us, and we will get back to you shortly!`;
        }

        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));

        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Chatbot API Error:', error);
        return NextResponse.json({ reply: "I'm having a little trouble connecting right now. Please try again!" }, { status: 500 });
    }
}
