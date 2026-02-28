// lib/onesignal.ts

const ONESIGNAL_APP_ID  = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_REST_API_KEY!

interface SendNotificationParams {
  title:    string
  message:  string
  userIds?: string[]
  url?:     string
}

export async function sendNotification({
  title,
  message,
  userIds,
  url,
}: SendNotificationParams) {
  const body: Record<string, any> = {
    app_id:   ONESIGNAL_APP_ID,
    headings: { en: title, pt: title },
    contents: { en: message, pt: message },
  }

  if (userIds && userIds.length > 0) {
    body.include_aliases = { external_id: userIds }
    body.target_channel  = 'push'
  } else {
    body.included_segments = ['Total Subscriptions']
  }

  if (url) body.url = url

  console.log('[OneSignal] Enviando notificação:', {
    title,
    userIds: userIds ?? 'todos',
    appId: ONESIGNAL_APP_ID,
    hasApiKey: !!ONESIGNAL_API_KEY,
  })

  const res = await fetch('https://onesignal.com/api/v1/notifications', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Basic ${ONESIGNAL_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  const json = await res.json()

  if (!res.ok || json.errors) {
    console.error('[OneSignal] Erro:', JSON.stringify(json))
    throw new Error(JSON.stringify(json))
  }

  console.log('[OneSignal] Notificação enviada:', json.id, '| recipients:', json.recipients)
  return json
}