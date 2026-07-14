# Circular dependency

Circular dependency is a concept where we create a deadlock of our modules which are dependent on each technically.
How ? : Module A -> Module B -> Module A
Here module A is being imported in B but module B is also imported in module A, during the runtime we go into error where the module A can have import error ( import B as undefined ).

Let us see how it looks ?

```
file.module.ts

@Module({
  imports : [BookingModule],
  providers: [FileService]
})
export class FileModule {
  constructor(private readonly bookingService: BookingService){}
}
```

```
bookings.module.ts

@Module({
  imports : [FileModule],
  providers: [BookingsService]
})
export class BookingsModule {
  constructor(private readonly fileService: FileService){}
}
```

Now this is what circular dependency looks like!

FileModule -> BookingsModule -> FileModule

Now to fix this issue we have two ways 

| Concept | Description |
| :--- | :--- |
| **forwardRef** | We create a closure and inside the arrow function we have our dependency |
| **Shared Module** | We create a separate file or module which contains things in common with business logic needed similar to the original with precautions like guards |

How we use forwardRef ?
Usually the thing which is undefined is dependent on what is the initial point of our execution
ex : A -> B -> A , here A is initial point thus B is importing A ( A is paused btw still waiting for B ), B tries to get A but as we know it is paused then it will throw A is undefined ( import error )

**NOTE** : We must use forwardRef on both sides as well export the missing services.

```
bookings.module.ts ( if this is entry point then FileModule needs to be in closure )

@Module({
    imports:[forwardRef(() => FileModule)],
    controllers:[BookingsController],
    providers:[BookingsService],
    exports:[BookingsService]
```

```
file.module.ts

@Module({
    imports:[forwardRef(() => BookingsModule)],
    controllers:[FileController],
    providers:[FileService],
    exports:[FileService]
```

This makes our NodeJS aware about the undefined in the parsing stage so that while runtime our NestJS then takes over the codebase and has the control over dependency resolution.

### Don't you think this forwardRef is little fishy here ?

1. Compiler wants to warn you but the use of forwardRef doesn't notify any architectural flaw caused by circular dependency.
2. Unit testing would be hectic here as we face same issue of circular dependency while testing
3. Scaling nightmare , scalable architecture has dependencies flow downwards but here we break the foundation and come back to monolith tied knot
4. This is a temporary fix but can be nightmare in longetivity thus only suitable for hotfixes.

### SharedModule ( Pure fix for circular dependency )

Simple and straight forward, we create a module that would share the services , business logics , etc... thus not creating a deadlock and we make sure that a developer create the shared module as single truth of source for that specific business logic breaking the circular dependency

FileModule -> SharedModule <- BookingsModule

We do not make it a GOD Module remember that because it might cause a huge trouble for us later in future with complex architecture , huge lines of code , makes our app more look like a slop than a scalable architectured backend.

Also the flow is maintained by flowing downward like 
1. FileModule -> imports -> SharedModule
2. BookingsModule -> imports -> SharedModule

Practically we don't write a GOD file so for separate serving purposes we have separate modules
ex : for booking receipt we use StorageCoreModule that would handle the booking receipts
Simple import in the File module

```
storage-core.service.ts

@Injectable()
export class StorageCoreService {
    getBookingReceipt(){
        return "Booking receipt business logic"
    }
}
```
Importing in file module
```
file.module.ts

@Module({
  imports : [StorageCoreModule],
  providers: [FileService]
})
export class FileModule {
  constructor(private readonly storageService: StorageCoreService){}
}
```

and for booking status we use AuditCoreService

```
audit-core.service.ts

@Injectable()
export class AuditCoreService {
    getBookingStatus(){
        return "Booking status business logic";
    }
}
```
Importing in booking module
```
bookings.module.ts

@Module({
  imports : [AuditCoreModule],
  providers: [BookingsService]
})
export class BookingsModule {
  constructor(private readonly auditService: AuditCoreService){}
}
```

**CRITICAL ENCAPSULATION RULE** : You do not import services; you import modules. If Module A needs a service from Module B, Module B must explicitly place that service into its exports array. If it is only in the providers array, the service remains permanently locked inside Module B, and your application will crash on boot.