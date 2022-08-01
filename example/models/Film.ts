// @generated
// Automatically generated. Don't change this file manually.
// Name: film

import { LanguageId } from './Language';
import MpaaRating from './MpaaRating';
import TsVector from 'ts-vector';

export type FilmId = number & { " __flavor"?: 'film' };

export default interface Film {
  /** Primary key. Index: film_pkey */
  film_id: FilmId;

  /** Index: idx_title */
  title: string;

  description: string | null;

  release_year: Year | null;

  /** Index: idx_fk_language_id */
  language_id: LanguageId;

  rental_duration: number;

  rental_rate: string;

  length: number | null;

  replacement_cost: string;

  rating: MpaaRating | null;

  last_update: Date;

  special_features: Text[] | null;

  /** Index: film_fulltext_idx */
  fulltext: TsVector;
}

export interface FilmInitializer {
  /**
   * Default value: nextval('film_film_id_seq'::regclass)
   * Primary key. Index: film_pkey
   */
  film_id?: FilmId;

  /** Index: idx_title */
  title: string;

  description?: string | null;

  release_year?: Year | null;

  /** Index: idx_fk_language_id */
  language_id: LanguageId;

  /** Default value: 3 */
  rental_duration?: number;

  /** Default value: 4.99 */
  rental_rate?: string;

  length?: number | null;

  /** Default value: 19.99 */
  replacement_cost?: string;

  /** Default value: 'G'::mpaa_rating */
  rating?: MpaaRating | null;

  /** Default value: now() */
  last_update?: Date;

  special_features?: Text[] | null;

  /** Index: film_fulltext_idx */
  fulltext: TsVector;
}
