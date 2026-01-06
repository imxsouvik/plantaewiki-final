import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const { error } = await supabase.from("contact_submissions").insert(data);
      if (error) throw error;
      setIsSuccess(true);
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
    } catch (error: any) {
      toast({ title: "Failed to send", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <section className="py-12 md:py-16">
        <div className="container max-w-xl">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Contact <span className="text-plant-yellow-dark">Us</span>
            </h1>
            <p className="text-muted-foreground">Have questions? We'd love to hear from you.</p>
          </div>

          {isSuccess ? (
            <div className="bg-plant-green/10 border border-plant-green/30 rounded-xl p-8 text-center animate-scale-in">
              <CheckCircle className="h-12 w-12 text-plant-green mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">Thank You!</h2>
              <p className="text-muted-foreground">Your message has been received.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-5 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" required placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required placeholder="Your message..." rows={5} />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                <Send className="h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
