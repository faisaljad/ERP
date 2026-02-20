import { prisma } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    // Collect aggregated metrics for the dashboard

    // 1. Total Customers
    const totalCustomers = await prisma.customer.count();

    // 2. Active Vendors
    const activeVendors = await prisma.vendor.count();

    // 3. Open POS Sessions
    const openSessions = await prisma.posSession.count({
        where: { status: "OPEN" }
    });

    // 4. Recent Sales Orders (Last 5)
    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
            customer: true
        }
    });

    // 5. Total Sales (Completed only)
    const totalSalesAggr = await prisma.order.aggregate({
        where: { status: "COMPLETED" },
        _sum: { total: true }
    });
    const totalSales = totalSalesAggr._sum.total || 0;

    // 6. Recent Purchase Orders
    const recentPOs = await prisma.purchaseOrder.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
            vendor: true
        }
    });

    // 7. Low Stock Alerts (threshold: 10)
    const lowStockItems = await prisma.item.findMany({
        where: {
            currentStock: {
                lte: 10 // Replace with item.reorderLevel in a real scenario
            }
        },
        take: 5
    });

    const serializedRecentOrders = recentOrders.map(order => ({
        ...order,
        subtotal: order.subtotal ? order.subtotal.toNumber() : 0,
        tax: order.tax ? order.tax.toNumber() : 0,
        discount: order.discount ? order.discount.toNumber() : 0,
        total: order.total ? order.total.toNumber() : 0,
    }));

    const serializedRecentPOs = recentPOs.map(po => ({
        ...po,
        subtotal: po.subtotal ? po.subtotal.toNumber() : 0,
        tax: po.tax ? po.tax.toNumber() : 0,
        discount: po.discount ? po.discount.toNumber() : 0,
        total: po.total ? po.total.toNumber() : 0,
    }));

    return {
        metrics: {
            totalCustomers,
            activeVendors,
            openSessions,
            totalSales: totalSales ? totalSales.toNumber() : 0
        },
        recentOrders: serializedRecentOrders,
        recentPOs: serializedRecentPOs,
        lowStockItems
    };
};
