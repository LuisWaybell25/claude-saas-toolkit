# Caso aplicado: cotizador para imprentas y señalética (producto #1)

Análisis de mercado y proyección financiera del primer producto de la cartera. Sirve como plantilla
del tipo de análisis que conviene hacer antes de fijar precio en cada producto nuevo.

> Esto es contenido de negocio de un producto específico, no arquitectura compartida — por eso vive
> fuera de `docs/arquitectura-estandar.md`. Cifras verificadas en agosto 2026, tipo de cambio
> $17.00 MXN/USD.

### Qué cobra la competencia directa (LatAm)

| Producto | Precio | Qué incluye |
|---|---|---|
| Litoplan (Colombia) | Desde US$65/mes (~$1,105 MXN/mes) con pago semestral | Solo cotizador de impresos offset, sin CRM |
| **Smartier Software** (Uruguay, el más comparable) | Desde $79/mes (~$1,343 MXN/mes), 3 usuarios | CRM + cotizador automático — nivel de features más parecido a nuestro MVP |
| Smartier Software, tier superior | $239/mes (~$4,063 MXN/mes), 5 usuarios | Agrega control de producción completo, inventario, planificación — más de lo que tiene nuestro MVP |
| Logic Print / Secre / WSC Printer | Sin precio público, venta directa | ERPs de escritorio o "enterprise" — típicamente más caros, cotizados por trato |

**Conclusión de mercado**: nuestro MVP (configuración + motor de cotización + CRM Kanban, sin planta de producción ni inventario) es más ligero que el tier base de Smartier. Eso da espacio para entrar por debajo de su precio de entrada y seguir siendo rentable.

### Precio sugerido y proyección para este SaaS

**Precio de lanzamiento sugerido: $29-49 USD/mes por taller** (~$495-835 MXN/mes), con un tier superior de $79-99 USD/mes (~$1,340-1,685 MXN/mes) para talleres con más usuarios o el módulo de WhatsApp/PDF avanzado. Justificación: por debajo del piso de Smartier ($79/mes), fácil de justificar con "ahorra horas de cotizar a mano por semana", sin competir de frente contra su tier de producción completa.

| Clientes pagando | Infra (Vercel Pro + Supabase Pro) | Ingreso a $40 USD/mes c/u | Ingreso equivalente MXN | Margen bruto |
|---|---|---|---|---|
| 10 | ~$45-70/mes (~$765-1,190 MXN) | $400/mes | ~$6,800 MXN/mes | ~85% |
| 50 | ~$70-120/mes (~$1,190-2,040 MXN) | $2,000/mes | ~$34,000 MXN/mes | ~95% |
| 200 | ~$150-300/mes (~$2,550-5,100 MXN) | $8,000/mes | ~$136,000 MXN/mes | ~96-98% |

El punto clave, como en toda la cartera: el costo de infraestructura **casi no sube con el número de clientes** en este stack (una sola base de datos multi-tenant, un solo hosting) — el margen bruto de infraestructura es altísimo desde muy pocos clientes. Lo que sí escala con clientes es *tu tiempo* (onboarding, soporte, ventas) — no el servidor.

### ¿Convendría AWS para este SaaS en particular? No, en esta etapa.

Para igualar lo que Supabase+Vercel dan en una sola factura (Postgres + Auth + Storage + hosting + CDN) en AWS necesitarías ensamblar RDS, un balanceador de carga (ALB), Fargate o EC2, NAT Gateway, S3, Cognito, CloudFront, Route53, WAF y Secrets Manager — y varias de esas piezas cobran una tarifa fija exista o no tráfico:

| Pieza en AWS | Costo aprox./mes (USD) | Costo aprox./mes (MXN) |
|---|---|---|
| RDS Postgres, solo nivel *dev* (db.t4g.micro, single-AZ) | ~$14-22 | ~$240-375 |
| RDS Postgres en configuración realmente productiva (Multi-AZ, HA) | ~$250-500 | ~$4,250-8,500 |
| Fargate para correr Next.js (la factura real, no la de la calculadora) | ~$90 | ~$1,530 |
| ALB + NAT Gateway (fijos, tengas 1 o 1,000 usuarios) | ~$35-50 | ~$595-850 |
| Cognito + S3 + Route53 + WAF + Secrets Manager | ~$10-20 | ~$170-340 |

Sumando la versión "seria" (RDS con HA + Fargate real): **~$385-660 USD/mes (~$6,550-11,220 MXN/mes)** solo para arrancar, contra los **$45-90 USD/mes (~$765-1,530 MXN/mes)** de Supabase+Vercel. Incluso la versión más barata posible en AWS (RDS dev + Fargate mínimo) ronda $90-150 USD/mes y ya pierdes la alta disponibilidad y backups automáticos que Supabase da por defecto en Pro.

Más allá del dinero: en AWS tú te vuelves responsable de VPC, IAM, parches del contenedor, y de construir tu propio pipeline de CI/CD — tiempo tuyo que no estás invirtiendo en el SaaS #2. AWS solo empezaría a tener sentido para *este* producto si llegara a decenas de miles de usuarios activos, o si un cliente enterprise exigiera control/compliance que Supabase no ofrece — una decisión para cuando ese momento llegue, no un punto de partida.

---
