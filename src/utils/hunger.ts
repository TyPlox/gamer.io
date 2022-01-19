export default class Actions {

    private static getAction(items: Array<string>): string {
        return items[Math.floor(Math.random()*items.length)];
    }

    public static death(killer: string, victim: string): string {

        const deaths = [
            `${killer} se pijeó a ${victim} de una trompada`,
            `${victim} se puso nervioso mientras ${killer} lo asesinaba gritando "A casa pete de mierda"`,
            `${victim} fue asesinado por ${killer} de tres tiros por andar en Puente Alto mientras escuchaba la frase "Espero que renazcas como una buena persona"`
        ];

        return Actions.getAction(deaths);

    }

    private static other(user: string, blessed: boolean): string {

        let others: Array<string>;

        if (blessed) {
            others = [
                `${user} se tropezó con un árbol, pero cayó de ella una manzana de la que pudo comer.`,
            ];
        } else {
            others = [
                `${user} se escondió detrás de un árbol a leer manga por miedo a que lo puteen por otaku conchesumare.`,
                `${user} huyó despavorido al enterarse de que Adam con su consolador iba detrás suyo`
            ];
        }

        return Actions.getAction(others);

    }

    private static attempt(killer: string, victim: string): string {

        const attempts = [
            `${killer} dijo "Huele a mierda" cuando vio a ${victim} y empezó a seguirlo.`
        ];

        return Actions.getAction(attempts);

    }

}