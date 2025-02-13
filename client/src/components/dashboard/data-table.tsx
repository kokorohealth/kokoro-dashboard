import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Sale } from "@shared/schema";
import { useState } from "react";

interface DataTableProps {
  sales: Sale[];
}

export function DataTable({ sales }: DataTableProps) {
  const [sortField, setSortField] = useState<keyof Sale>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedSales = [...sales].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Sale) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("product")}
              >
                Product
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                Amount
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.product}</TableCell>
                <TableCell>${sale.amount.toLocaleString()}</TableCell>
                <TableCell>
                  {new Date(sale.date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
