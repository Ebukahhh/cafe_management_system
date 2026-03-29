Γû▓ Next.js 16.2.1 (Turbopack)
- Environments: .env.local, .env

  Creating an optimized production build ...
node.exe : (node:14840) [M
ODULE_TYPELESS_PACKAGE_JSO
N] Warning: Module type 
of file:///C:/Users/Sober/
Desktop/cafe_mgt_system/ta
ilwind.config.ts?id=177479
5356597 is not specified 
and it doesn't parse as 
CommonJS.
At line:1 char:1
+ & "C:\Program 
Files\nodejs/node.exe" "C:
\Users\Sober\AppData\Roami
ng\ ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~
    + CategoryInfo        
      : NotSpecified: ((  
  node:14840) [M...se a   
 s CommonJS.:String) [    
], RemoteException
    + FullyQualifiedError 
   Id : NativeCommandErr  
  or
 
Reparsing as ES module 
because module syntax was 
detected. This incurs a 
performance overhead.
To eliminate this 
warning, add "type": 
"module" to C:\Users\Sober
\Desktop\cafe_mgt_system\p
ackage.json.
(Use `node 
--trace-warnings ...` to 
show where the warning 
was created)
Γ£ô Compiled successfully in 31.2s
  Running TypeScript ...
Failed to type check.

./src/lib/supabase/mutatio
ns/create-order.ts:33:6
Type error: No overload 
matches this call.
  Overload 1 of 2, 
'(values: never, 
options?: { count?: 
"exact" | "planned" | 
"estimated" | undefined; 
} | undefined): 
PostgrestFilterBuilder<{ 
PostgrestVersion: "12"; 
}, never, never, null, 
"orders", never, 
"POST">', gave the 
following error.
    Argument of type '{ 
user_id: string; status: 
string; order_type: 
OrderType; subtotal: 
number; total: number; 
note: string | null; 
promo_code: string | 
null; }' is not 
assignable to parameter 
of type 'never'.
  Overload 2 of 2, 
'(values: never[], 
options?: { count?: 
"exact" | "planned" | 
"estimated" | undefined; 
defaultToNull?: boolean | 
undefined; } | 
undefined): 
PostgrestFilterBuilder<{ 
PostgrestVersion: "12"; 
}, never, never, null, 
"orders", never, 
"POST">', gave the 
following error.
    Object literal may 
only specify known 
properties, and 'user_id' 
does not exist in type 
'never[]'.

  [90m31 |[0m   
[36mconst[0m { data: 
order, error: orderError 
} = [36mawait[0m 
supabase
  [90m32 |[0m     .[36m
from[0m([32m'orders'[0m
)
[31m[1m>[0m [90m33 
|[0m     .insert({
  [90m   |[0m      
[31m[1m^[0m
  [90m34 |[0m       
user_id: input.userId,
  [90m35 |[0m       
status: 
[32m'pending'[0m,
  [90m36 |[0m       
order_type: 
input.orderType,
Next.js build worker 
exited with code: 1 and 
signal: null
