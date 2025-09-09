import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Webhook, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-balance">Discord Deployment Webhooks</h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Automated Discord notifications for your deployment pipeline
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Endpoint
              </CardTitle>
              <CardDescription>Receives deployment events from Vercel</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">/api/webhook/deployment</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Configure this endpoint in your Vercel project settings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Discord Integration
              </CardTitle>
              <CardDescription>Sends formatted messages to your Discord channel</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">Ready to Configure</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Add your Discord webhook URL to environment variables
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Environment Variables</h4>
              <p className="text-sm text-muted-foreground">
                Add <code className="bg-muted px-1 rounded">DISCORD_WEBHOOK_URL</code> to your environment variables
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. Vercel Webhook</h4>
              <p className="text-sm text-muted-foreground">
                Configure <code className="bg-muted px-1 rounded">https://your-domain.com/api/webhook/deployment</code>{" "}
                in Vercel project settings
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. Events</h4>
              <p className="text-sm text-muted-foreground">
                Select "deployment.created" and "deployment.succeeded" events
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
