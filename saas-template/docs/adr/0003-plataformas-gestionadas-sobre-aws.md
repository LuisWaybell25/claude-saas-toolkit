# ADR-0003: Plataformas gestionadas (Supabase + Vercel) sobre AWS a la carta

- **Fecha**: 2026-08-23
- **Estado**: Aceptado

## Contexto

Necesitamos base de datos, autenticación, almacenamiento de archivos y hosting para toda la cartera
de SaaS. El equipo es pequeño (1-3 personas) y el objetivo es lanzar varios productos, no operar
infraestructura.

## Alternativas consideradas

- **AWS a la carta** (RDS + Cognito + S3 + ECS/Fargate + ALB + NAT Gateway + Route53 + WAF +
  Secrets Manager) — máximo control y el techo de escalabilidad más alto.
- **Supabase + Vercel** — Postgres, Auth, Storage y hosting en dos plataformas, dos facturas.

### Comparación de costo para un producto típico de la cartera

| | Costo mensual aproximado |
|---|---|
| Vercel + Supabase | **$765-1,530 MXN** (~$45-90 USD) |
| AWS mínimo (RDS sin alta disponibilidad, Fargate básico) | ~$1,530-2,550 MXN (~$90-150 USD) |
| AWS en configuración productiva real (RDS Multi-AZ + Fargate + ALB + NAT) | ~$6,550-11,220 MXN (~$385-660 USD) |

En AWS, el balanceador de carga, el NAT Gateway y una base de datos con alta disponibilidad cobran
tarifa fija exista o no tráfico. Supabase y Vercel ya pagaron esa infraestructura y la reparten
entre miles de clientes propios — algo que nosotros no podemos igualar con pocos tenants.

## Decisión

**Supabase + Vercel.**

El costo en dinero es entre 2x y 7x menor a nuestra escala, pero el argumento principal es el costo
en tiempo: en AWS seríamos responsables de VPC, subnets, IAM, parches del contenedor, y de
construir el pipeline de CI/CD y la UI de autenticación que Supabase y Vercel dan hechos. Ese
tiempo no estaría construyendo el producto #2.

## Consecuencias

- Aceptamos lock-in medio en identidad/sesión (Supabase Auth) a cambio de no construir
  autenticación propia — la categoría de código donde un bug cuesta más caro por el menor beneficio.
- El lock-in es bajo en las piezas que más importan: Postgres es estándar (`pg_dump` a cualquier
  proveedor) y Prisma habla con cualquier Postgres, así que migrar la base sería cambiar la
  connection string.
- No tenemos control fino sobre la infraestructura. Si un producto necesita algo muy específico
  (una región concreta, una VPC privada), habría que resolverlo por excepción.

## Cuándo reconsiderar

- Cuando un producto específico llegue a decenas de miles de usuarios activos y tenga ingresos que
  justifiquen dedicar tiempo real de DevOps — ahí los Reserved Instances y Savings Plans de AWS sí
  bajan el costo por debajo de lo gestionado.
- Cuando un cliente empresarial exija control o cumplimiento que Supabase/Vercel no ofrezcan.

En ambos casos, la migración sería **de ese producto**, no de toda la cartera.
