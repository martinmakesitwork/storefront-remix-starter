import * as React from "react";
import { Button } from "~/components/ui/button";
import { SimpleInput } from "~/components/SimpleInput";

export function NewsletterSignup() {
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    console.log("Newsletter signup for:", email);
    alert(`Thank you for signing up, ${email}! (Placeholder)`);
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <SimpleInput
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        required
        className="border-gray-700 bg-gray-800 text-white placeholder-gray-500" // Example styling
      />
      <Button type="submit" variant="default" className="bg-white text-gray-900 hover:bg-gray-200">
        Subscribe
      </Button>
    </form>
  );
}