import { type NextRequest, NextResponse } from "next/server"

interface DeploymentEvent {
  type: "deployment.created" | "deployment.succeeded" | "deployment.failed" | "deployment.promoted"
  createdAt: number
  payload: {
    deployment: {
      id: string
      url: string
      name: string
      target?: string
      meta?: any
      inspectorUrl?: string
    }
    project: {
      id: string
      name?: string
    }
    team?: {
      id: string
    }
    user?: {
      id: string
    }
    name: string
    url: string
  }
}

interface DiscordEmbed {
  title: string
  description: string
  color: number
  fields: Array<{
    name: string
    value: string
    inline?: boolean
  }>
  timestamp: string
  footer: {
    text: string
  }
}

async function sendDiscordMessage(embed: DiscordEmbed) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL environment variable is not set")
    return false
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    })

    if (!response.ok) {
      console.error("Failed to send Discord message:", response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.error("Error sending Discord message:", error)
    return false
  }
}

function createEmbed(event: DeploymentEvent): DiscordEmbed {
  const { type, payload, createdAt } = event
  const { deployment, project, team, name, url } = payload

  const colors = {
    "deployment.created": 0x3498db,
    "deployment.succeeded": 0x2ecc71,
    "deployment.failed": 0xe74c3c,
    "deployment.promoted": 0x9b59b6,
  }

  const titles = {
    "deployment.created": "🚀 Deployment Started",
    "deployment.succeeded": "✅ Deployment Successful",
    "deployment.failed": "❌ Deployment Failed",
    "deployment.promoted": "🎯 Deployment Promoted",
  }

  const embed: DiscordEmbed = {
    title: titles[type] || "📦 Deployment Event",
    description: `**${name}** deployment ${type === "deployment.created" ? "started" : type === "deployment.succeeded" ? "completed successfully" : type === "deployment.promoted" ? "was promoted to production" : "failed"}`,
    color: colors[type] || 0x95a5a6,
    fields: [
      {
        name: "Project",
        value: project.name || name,
        inline: true,
      },
      {
        name: "Branch/Target",
        value: deployment.target || "production",
        inline: true,
      },
      {
        name: "Deployment ID",
        value: deployment.id.substring(0, 12) + "...",
        inline: true,
      },
    ],
    timestamp: new Date(createdAt).toISOString(),
    footer: {
      text: "Vercel Deployment",
    },
  }

  if ((type === "deployment.succeeded" || type === "deployment.promoted") && url) {
    embed.fields.push({
      name: "Live URL",
      value: `https://${url}`,
      inline: false,
    })
  }

  if (deployment.inspectorUrl) {
    embed.fields.push({
      name: "Inspector",
      value: deployment.inspectorUrl,
      inline: false,
    })
  }

  return embed
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DeploymentEvent

    console.log("[v0] =================================")
    console.log("[v0] Webhook received at:", new Date().toISOString())
    console.log("[v0] Full webhook body:", JSON.stringify(body, null, 2))
    console.log("[v0] Event type:", body.type)
    console.log("[v0] Discord webhook URL set:", !!process.env.DISCORD_WEBHOOK_URL)
    console.log("[v0] =================================")

    if (!["deployment.created", "deployment.succeeded", "deployment.promoted"].includes(body.type)) {
      console.log("[v0] Event type not handled, skipping:", body.type)
      return NextResponse.json({ message: "Event type not handled" }, { status: 200 })
    }

    console.log("[v0] Processing event:", body.type)
    const embed = createEmbed(body)
    console.log("[v0] Created embed:", JSON.stringify(embed, null, 2))

    const success = await sendDiscordMessage(embed)

    if (success) {
      console.log("[v0] Discord message sent successfully")
      return NextResponse.json({ message: "Discord notification sent" }, { status: 200 })
    } else {
      console.log("[v0] Failed to send Discord message")
      return NextResponse.json({ message: "Failed to send Discord notification" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    console.error("[v0] Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "Deployment webhook endpoint is active" }, { status: 200 })
}
