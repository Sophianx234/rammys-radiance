import { connectToDatabase } from '@/lib/connectDB';
import { DecodedToken } from '@/lib/jwtConfig';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  await connectToDatabase();
  
  // Prevent Next.js from tree-shaking the Product model import!
  Product.init();

  const token = req.cookies.get('token')?.value;
  console.log(token)

  if (!token) return NextResponse.json({ user: null });

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById((decoded as DecodedToken).userId).populate("cart.product") // ← this is what you need
      .lean();
    
    return NextResponse.json({ user });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ user: null });
  }
}
