declare namespace collab.decorator {

    interface IComponent {
        name: string;
        template: string;
    }

    interface IBootstrap {
        template: string;
    }

    interface IDecoratorVar {
        name: string;
        component: IComponent;
        target: any;
    }
}
