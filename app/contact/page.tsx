import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Mail, MessageSquare, Clock, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <section className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl font-bold text-white mb-4">
              Get in <span className="text-gold-gradient">Touch</span>
            </h1>
            <p className="text-white/50 max-w-xl mx-auto">
              Koi bhi sawaal ho — payment, credits, ya technical issue — hum 1-2 ghante mein reply karte hain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact info */}
            <div className="space-y-5">
              {[
                { icon: Mail, title: 'Email Support', detail: 'support@voiceflow.in', sub: 'Reply within 1-2 hours' },
                { icon: MessageSquare, title: 'WhatsApp', detail: '+91 XXXXX XXXXX', sub: 'Mon–Sat, 10AM–8PM IST' },
                { icon: Clock, title: 'Response Time', detail: 'Usually within 2 hours', sub: 'For payment issues: within 30 mins' },
                { icon: MapPin, title: 'Based in', detail: 'India 🇮🇳', sub: 'Serving users across India' },
              ].map(item => (
                <div key={item.title} className="glass rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-gold-400 text-sm">{item.detail}</p>
                    <p className="text-white/40 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-5">Send us a message</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Name</label>
                  <input type="text" className="input-dark" placeholder="Aapka naam" />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Email</label>
                  <input type="email" className="input-dark" placeholder="aap@example.com" />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Subject</label>
                  <select className="input-dark">
                    <option value="">Select a topic</option>
                    <option>Payment Issue</option>
                    <option>Credits not added</option>
                    <option>Technical problem</option>
                    <option>Billing question</option>
                    <option>Feature request</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Message</label>
                  <textarea className="input-dark resize-none min-h-[120px]" placeholder="Aapki problem ya sawaal..." />
                </div>
                <button className="btn-gold w-full py-3.5">Send Message</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
