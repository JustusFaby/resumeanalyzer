import { createRemoteJWKSet, jwtVerify } from 'jose'

const region = process.env.COGNITO_REGION
const userPoolId = process.env.COGNITO_USER_POOL_ID
const clientId = process.env.COGNITO_CLIENT_ID

const issuer = region && userPoolId ? `https://cognito-idp.${region}.amazonaws.com/${userPoolId}` : ''
const jwks = issuer ? createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`)) : null

export async function requireAuth(req, res, next) {
  if (!issuer || !clientId || !jwks) {
    res.status(500).json({ message: 'Auth is not configured on the server.' })
    return
  }

  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    res.status(401).json({ message: 'Missing Authorization header.' })
    return
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience: clientId,
    })

    req.userId = payload.sub
    req.userEmail = payload.email
    next()
  } catch (_error) {
    res.status(401).json({ message: 'Invalid or expired token.' })
  }
}
