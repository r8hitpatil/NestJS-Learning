# Injection scopes

Scopes is nothing but providing a lifetime for an instance in our application.

### Types of Scopes we have

| DEFAULT | A single instance is created at the time when our application is started and shared across. |
| REQUEST | A new instance is created every time we have a new request and it is cleared or garbage collected by our Node only when the HTTP response is sent back to client |
| TRANSIENT | Transient providers are not shared accross consumers. Each consumer that injects the transient will have a new instance |

How do we use a scope / inject the scope

```

@Injectable({ scope : Scope.REQUEST })
export class DogService {}
```

For custom providers

```

@Module({})
export class DogModule {
  static register() {
    return {
      providers : [{
        provide : 'DOGESH',
        useClass : DogService,
        scope : Scope.TRANSIENT
      }],
    }
  }
}

```

### Scope Hierarchy

The scope hierarchy is simple
repository > service > controller , inshort scope bubbles up. If a singleton controller injects a request scoped service, controller is pushed into request scope.

example : If you put a scope on service then your controllers are also included because controller is dependent on service.

But there is a catch : 
Transient scoped dependencies don't follow the pattern.
If singleton-scoped DogService injects transient LoggerService then it will recieve fresh instance not including the DogService to re-instantiate or new instance until and unless the DogService is explicitly marked as TRANSIENT as well

### Request Provider

You might want to use the request object and thus REQUEST is helpful to automatically fetch the properties

```

@Injectable({ scope : Scope.REQUEST })
export class DogService {
    constructor(@Inject(REQUEST) private request: Request){}
}
```

It is used for some situtations where you want to access the login creds , jwt , sessions and all without being overridden by other uses data or properties, even if singleton scope is 100% safe but if there is a edge case where you want to store the data like below's given example

```
@Injectable()
export class BadAuthService {
  private currentUserToken: string; // Shared state in a Singleton!

  login(dto: LoginDto) {
    this.currentUserToken = this.generateJwt(dto.userId); 
    // If User B hits this line 1 millisecond after User A, 
    // User B overwrites User A's token!
    
    return { token: this.currentUserToken };
  }
}
```

Inshort, you can avoid the prop dilling and simply use REQUEST for architectural convenience other wise singleton is also good but at sharedState ( stored in heap ) then must be const or let for execution stack isolation so that having the reference is easy even if different users try to do some operations.