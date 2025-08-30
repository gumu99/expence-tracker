import { useState, useEffect } from "react";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AboutUsProps {
  onBack: () => void;
}

export const AboutUs = ({ onBack }: AboutUsProps) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/about-us.txt');
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setContent("About Us content file not found. Please add your team information to the about-us.txt file in the public folder.");
        }
      } catch (error) {
        setContent("Welcome to Expense Tracker!\n\nThis application helps you manage your personal finances with ease.\n\nFeatures:\n• Track income and expenses\n• Visual spending analytics\n• Financial alerts and insights\n• Export transaction data\n• User-friendly interface\n\nTo customize this page, edit the about-us.txt file in the public folder.\n\nDeveloped with ❤️ for better financial management.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">About Us</h1>
          <p className="text-muted-foreground">Learn more about our team</p>
        </div>
      </div>

      {/* Content Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Our Team</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
              {content}
            </pre>
          </div>
        )}
      </Card>

      {/* Instructions for developers */}
      <Card className="p-4 bg-muted/50">
        <p className="text-xs text-muted-foreground">
          <strong>For developers:</strong> Edit the <code>public/about-us.txt</code> file to customize this content.
        </p>
      </Card>
    </div>
  );
};