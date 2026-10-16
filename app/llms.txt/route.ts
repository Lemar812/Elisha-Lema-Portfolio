import {brand,siteUrl} from '@/lib/site';
export function GET(){return new Response(`# ${brand.name}\n\n${brand.description}\n\n- [About Elisha](${siteUrl}/about)\n- [Selected work](${siteUrl}/work)\n- [Services](${siteUrl}/services)\n- [Resume](${siteUrl}/resume)\n- [Notes](${siteUrl}/writing)\n\nContact: elishalema12@gmail.com\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
