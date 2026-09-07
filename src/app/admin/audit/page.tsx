import AuditClient from "./audit-client";
import { getAllAuditLogs } from "@/lib/admin-data";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; actionType?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = searchParams.search || "";
  const actionTypes = searchParams.actionType ? searchParams.actionType.split(",") : [];

  const { logs, pagination } = await getAllAuditLogs({
    page,
    limit: 20,
    search,
    actionTypes,
  });

  return (
    <AuditClient 
      initialLogs={logs} 
      pagination={pagination}
      currentSearch={search}
      currentActionTypes={actionTypes}
    />
  );
}
