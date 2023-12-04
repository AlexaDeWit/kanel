// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { cityId } from './City';
import type { CityId } from './City';
import { z } from 'zod';

/** Identifier type for address */
export type AddressId = number & { __flavor?: 'AddressId' };

/** Represents the table public.address */
export default interface Address {
  /** Database type: pg_catalog.int4 */
  address_id: AddressId;

  /** Database type: pg_catalog.varchar */
  address: string;

  /** Database type: pg_catalog.varchar */
  address2: string | null;

  /** Database type: pg_catalog.varchar */
  district: string;

  /** Database type: pg_catalog.int2 */
  city_id: CityId;

  /** Database type: pg_catalog.varchar */
  postal_code: string | null;

  /** Database type: pg_catalog.varchar */
  phone: string;

  /** Database type: pg_catalog.timestamp */
  last_update: Date;
}

/** Represents the initializer for the table public.address */
export interface AddressInitializer {
  /**
   * Database type: pg_catalog.int4
   * Default value: nextval('address_address_id_seq'::regclass)
   */
  address_id?: AddressId;

  /** Database type: pg_catalog.varchar */
  address: string;

  /** Database type: pg_catalog.varchar */
  address2?: string | null;

  /** Database type: pg_catalog.varchar */
  district: string;

  /** Database type: pg_catalog.int2 */
  city_id: CityId;

  /** Database type: pg_catalog.varchar */
  postal_code?: string | null;

  /** Database type: pg_catalog.varchar */
  phone: string;

  /**
   * Database type: pg_catalog.timestamp
   * Default value: now()
   */
  last_update?: Date;
}

/** Represents the mutator for the table public.address */
export interface AddressMutator {
  /** Database type: pg_catalog.int4 */
  address_id?: AddressId;

  /** Database type: pg_catalog.varchar */
  address?: string;

  /** Database type: pg_catalog.varchar */
  address2?: string | null;

  /** Database type: pg_catalog.varchar */
  district?: string;

  /** Database type: pg_catalog.int2 */
  city_id?: CityId;

  /** Database type: pg_catalog.varchar */
  postal_code?: string | null;

  /** Database type: pg_catalog.varchar */
  phone?: string;

  /** Database type: pg_catalog.timestamp */
  last_update?: Date;
}

export const addressId = z.number();

export const address =
z.object({
  address_id: addressId,
  address: z.string(),
  address2: z.string().nullable(),
  district: z.string(),
  city_id: cityId,
  postal_code: z.string().nullable(),
  phone: z.string(),
  last_update: z.date(),
}) satisfies z.ZodType<Address>;

export const addressInitializer =
z.object({
  address_id: addressId.optional(),
  address: z.string(),
  address2: z.string().optional().nullable(),
  district: z.string(),
  city_id: cityId,
  postal_code: z.string().optional().nullable(),
  phone: z.string(),
  last_update: z.date().optional(),
}) satisfies z.ZodType<AddressInitializer>;

export const addressMutator =
z.object({
  address_id: addressId.optional(),
  address: z.string().optional(),
  address2: z.string().optional().nullable(),
  district: z.string().optional(),
  city_id: cityId.optional(),
  postal_code: z.string().optional().nullable(),
  phone: z.string().optional(),
  last_update: z.date().optional(),
}) satisfies z.ZodType<AddressMutator>;
