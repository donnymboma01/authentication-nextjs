"use server";

import * as z from "zod";
import bcrypt from "bcrypt";

import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // const user_exists = await db.user.findUnique({
  //   where: { email },
  // });
  // alternative de bcrypt : bcryptjs
  const user_exists = await getUserByEmail(email);

  if (user_exists) {
    return { error: "Cet utilisateur existe déjà" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // TODO: Envoi d'un email de confirmation.
  return { success: "Utilisateur créé avec succes" };
};
