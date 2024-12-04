export default function LegalPage() {
    return (
      <div className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Legal Information</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold">Company Information</h2>
            <p>
              TrychAI is operated by TrychAI, Inc. ("we," "us," or "our"), a company dedicated to providing innovative AI-powered market research solutions.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold">Contact Information</h2>
            <p>
              For any legal inquiries, please reach out to us at:<br />
              <a href="mailto:support@trychai.io" className="text-blue-600 hover:underline">support@trychai.io</a>
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold">Intellectual Property</h2>
            <p>
              All content, features, and functionality of the TrychAI platform, including but not limited to text, graphics, logos, icons, and images, are the exclusive property of TrychAI, Inc. and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold">Disclaimer</h2>
            <p>
              The information provided on TrychAI is for general informational purposes only. While we strive to keep the information up to date and accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the platform or the information contained on it.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold">Governing Law</h2>
            <p>
              These legal terms and any disputes arising out of or relating to these terms or your use of TrychAI shall be governed by and construed in accordance with the laws of the jurisdiction in which TrychAI, Inc. is registered, without regard to its conflict of law principles.
            </p>
          </section>
        </div>
      </div>
    )
  }