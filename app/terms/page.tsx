export default function TermsPage() {
    return (
      <div className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Terms of Use</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
  
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing and using TrychAI, you accept and agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please refrain from using our platform.
          </p>
  
          <h2 className="text-2xl font-semibold">2. Use of Service</h2>
          <p>
            You agree to use TrychAI only for lawful purposes and in accordance with these Terms. You are prohibited from:
          </p>
          <ul className="list-disc list-inside">
            <li>Using the service for any illegal purpose</li>
            <li>Attempting to gain unauthorized access to any part of the platform</li>
            <li>Interfering with or disrupting the service</li>
            <li>Collecting user information without consent</li>
          </ul>
  
          <h2 className="text-2xl font-semibold">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
          </p>
  
          <h2 className="text-2xl font-semibold">4. Content and Copyright</h2>
          <p>
            All content generated through our platform is subject to our content policies. While you retain rights to your input data, we maintain rights to the AI models and technology used to generate reports.
          </p>
  
          <h2 className="text-2xl font-semibold">5. Limitation of Liability</h2>
          <p>
            TrychAI is provided &quot;as is&quot; without any warranties. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
          </p>
  
          <h2 className="text-2xl font-semibold">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.
          </p>
  
          <h2 className="text-2xl font-semibold">7. Termination</h2>
          <p>
            We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any breach of these Terms of Use.
          </p>
        </div>
      </div>
    )
  }