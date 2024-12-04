export default function PrivacyPage() {
    return (
      <div className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
  
          <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside">
            <li>Account information (name, email, password)</li>
            <li>Usage data and research queries</li>
            <li>Payment information</li>
            <li>Communication preferences</li>
          </ul>
  
          <h2 className="text-xl font-semibold mt-6">2. How We Use Your Information</h2>
          <p>
            We use the collected information to:
          </p>
          <ul className="list-disc list-inside">
            <li>Provide and maintain our services</li>
            <li>Process your transactions</li>
            <li>Send you service-related communications</li>
            <li>Improve and personalize our services</li>
            <li>Comply with legal obligations</li>
          </ul>
  
          <h2 className="text-xl font-semibold mt-6">3. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
          </p>
  
          <h2 className="text-xl font-semibold mt-6">4. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc list-inside">
            <li>Service providers who assist in our operations</li>
            <li>Legal authorities when required by law</li>
            <li>Business partners with your consent</li>
          </ul>
  
          <h2 className="text-xl font-semibold mt-6">5. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc list-inside">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Data portability</li>
          </ul>
  
          <h2 className="text-xl font-semibold mt-6">6. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
  
          <h2 className="text-xl font-semibold mt-6">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:<br />
            <a href="mailto:support@trychai.io" className="text-blue-600 hover:underline">support@trychai.io</a>
          </p>
        </div>
      </div>
    )
  }