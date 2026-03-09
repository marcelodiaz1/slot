export async function GET() {
  return Response.json({ 
    keyExists: !!process.env.STRIPE_SECRET_KEY,
    preview: process.env.STRIPE_SECRET_KEY ? `${process.env.STRIPE_SECRET_KEY.slice(0, 7)}...` : 'none'
  });
}