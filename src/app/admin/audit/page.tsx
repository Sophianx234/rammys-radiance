import AuditClient from "./audit-client";
import { getAllAuditLogs } from "@/lib/admin-data";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; actionType?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1;
  const search = resolvedSearchParams.search || "";
  const actionTypes = resolvedSearchParams.actionType ? resolvedSearchParams.actionType.split(",") : [];

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
