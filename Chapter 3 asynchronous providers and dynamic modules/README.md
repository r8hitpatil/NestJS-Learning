# Async providers and dynamic modules

### Async providers

When we want our application to wait for a async operation before it starts accepting the requests is what we can achieve with the help of async providers.

Example: If we don't want to start the application before it create a database connection 

We can achieve it by useFactory
example :
