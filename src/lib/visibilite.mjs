/**
 * Pages non publiées en production faute de contenu réel (module sans dépendance à Vite :
 * utilisé par les pages, par astro.config.mjs pour le sitemap et par les redirections).
 */
import { garage } from '../data/garage.mjs';
import { avis } from '../data/avis.mjs';
import { communes, pagePrete } from '../data/communes.mjs';

export function pagesMasquees(production) {
  if (!production) return [];
  const masquees = ['/brouillon/'];
  if (!garage.liens.googleAvis && avis.length === 0) masquees.push('/avis/');
  if (!garage.liens.googleAvis) masquees.push('/avis/carte/');
  if (!communes.some(pagePrete)) masquees.push('/communes-proches/');
  return masquees;
}
