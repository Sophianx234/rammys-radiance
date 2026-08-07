import { Suspense } from "react";
import { GridLoader } from "react-spinners";
import { getAllCustomers } from "@/lib/admin-data";
import { CustomersClient } from "./customers-client";

export default async function AdminUsersPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;

  return (
    <Suspense fallback={
      <div className="flex inset-0 h-dvh items-center justify-center">
        <GridLoader size={18} color="#5B7763" />
      </div>
    }>
      <CustomersData searchParams={searchParams} />
    </Suspense>
  );
}

async function CustomersData({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const role = typeof searchParams.role === 'string' ? searchParams.role : undefined;

  const customers = await getAllCustomers(search, role);

  return <CustomersClient initialUsers={customers} />;
}