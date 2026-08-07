import { Suspense } from "react";
import { GridLoader } from "react-spinners";
import { getAllOrders } from "@/lib/admin-data";
import { OrdersClient } from "./orders-client";

export default async function OrdersManagementPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  
  return (
    <Suspense fallback={
      <div className="flex inset-0 h-dvh items-center justify-center">
        <GridLoader size={18} color="#5B7763" />
      </div>
    }>
      <OrdersData searchParams={searchParams} />
    </Suspense>
  );
}

async function OrdersData({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const dateFilter = typeof searchParams.dateFilter === 'string' ? searchParams.dateFilter : undefined;
  
  const statusParam = searchParams.status;
  let statusArray: string[] = [];
  if (typeof statusParam === 'string') {
    statusArray = statusParam.split(',');
  }

  const { orders, pagination } = await getAllOrders({
    page,
    limit: 10,
    search,
    status: statusArray,
    dateFilter
  });

  return <OrdersClient initialOrders={orders} pagination={pagination} />;
}