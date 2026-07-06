import { ConfigurableModuleBuilder } from "@nestjs/common";

export interface StripeModuleOptions{
    apiKey: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = (
    new ConfigurableModuleBuilder<StripeModuleOptions>()
    .setClassMethodName('forRoot')
    .build()
)