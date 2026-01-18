import { Card, CardContent } from "@/components/ui/card";
import { siteSettings } from "@/utils/constants";

export default function ContactPage() {
  const { contact } = siteSettings;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Address</h2>
              <p>{contact.address}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Phone</h2>
              <p>{contact.phone}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Email</h2>
              <p>{contact.email}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <form className="space-y-4">
              <div>
                <label className="block mb-1" htmlFor="name">Name</label>
                <input id="name" className="w-full border rounded p-2" type="text" required />
              </div>
              <div>
                <label className="block mb-1" htmlFor="email">Email</label>
                <input id="email" className="w-full border rounded p-2" type="email" required />
              </div>
              <div>
                <label className="block mb-1" htmlFor="message">Message</label>
                <textarea id="message" className="w-full border rounded p-2" rows={4} required />
              </div>
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Send</button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
