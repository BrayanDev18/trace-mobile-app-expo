import {useSQLiteContext} from "expo-sqlite";
import {drizzle} from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

export function useDatabase() {
  const expoDb = useSQLiteContext()

  return drizzle(expoDb, {schema})
}