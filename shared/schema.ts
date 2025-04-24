import { pgTable, text, serial, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  customerNumber: text("customer_number").notNull(),
  customerIntercom: text("customer_intercom"),
  deliveryInstructions: text("delivery_instructions"),
  notes: text("notes"),
  items: text("items").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  customerAddress: true,
  customerNumber: true,
  customerIntercom: true,
  deliveryInstructions: true,
  notes: true,
  items: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const emailOrderSchema = z.object({
  customerName: z.string().min(2, "Nome richiesto"),
  customerEmail: z.string().email("Email non valida"),
  customerPhone: z.string().min(6, "Telefono richiesto"),
  customerAddress: z.string().min(5, "Indirizzo richiesto"),
  customerNumber: z.string().min(1, "Numero civico richiesto"),
  customerIntercom: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  notes: z.string().optional(),
  items: z.string()
});
