import { NextResponse } from "next/server";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/connectDB";
import "@/models/Product";
import { Product } from "@/models/Product";
import { orderConfirmationEmail } from "@/lib/email-templates";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) { 
  try {
    await connectToDatabase();
    const data = await req.json();

    // Validate stock first BEFORE creating the order
    for (const item of data.cart) {
      const product = await Product.findById(item._id);

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item._id}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Insufficient stock for ${product.name}. Only ${product.stock} left.` 
          },
          { status: 400 }
        );
      }
    }

    // Deduct stock
    for (const item of data.cart) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { stock: -item.quantity },
        $set: { inStock: item.stock - item.quantity > 0 }
      });
    }

    // Create the order after successful stock deduction
    const newOrder = await Order.create({
      user: data.userId,
      customer: {
        phone: data.formData.phone,
      },

      deliveryAddress: {
        address: data.formData.address,
        city: data.formData.city,
        region: data.formData.region,
        lat: data.formData.lat,
        lng: data.formData.lng,
      },

      items: data.cart.map((item: any) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      })),

      totalAmount: data.total,
      paymentStatus: "paid",
      paymentReference: data.reference,
      orderStatus: "processing",
    });

    // Clear cart and update user profile info
    if (data.userId) {
      await User.findByIdAndUpdate(data.userId, { 
        cart: [],
        phone: data.formData.phone,
        name: data.formData.fullName,
      });
    }

     const user = await User.findById(data.userId);
    if (user?.email) {
      await sendMail({
        to: user.email,
        subject: "Your Order Has Been Confirmed – Rammy’s Closet",
        html: orderConfirmationEmail({
          name: user.name || "Customer",
          orderId: newOrder._id.toString(),
          items: await Promise.all(
            newOrder.items.map(async (item: any) => {
              const product = await Product.findById(item.product);
              return {
                name: product?.name || "Unknown Product",
                quantity: item.quantity,
                price: item.price,
              };
            })
          ),
          totalAmount: newOrder.totalAmount,
          address: `${newOrder.deliveryAddress.address}, ${newOrder.deliveryAddress.city}, ${newOrder.deliveryAddress.region}`,
        }),
      });
    }
    return NextResponse.json({ success: true, order: newOrder });

  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}



export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") || "";

    const query: any = {};

    // Search by order ID, phone, reference
    if (search) {
      query.$or = [
        { paymentReference: { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query)
      .populate("user",'-password')
      .populate("items.product")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
      console.log('orderxxx',orders);

    const totalOrders = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total: totalOrders,
        page,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

