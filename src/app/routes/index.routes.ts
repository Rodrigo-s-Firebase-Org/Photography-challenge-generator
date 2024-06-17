interface IRoute {
    [pathname: string]: boolean
}

export const routes: IRoute = {
    '/': false,
    '/photos': true,
    '/profile': true,
    '/upload': true,
}
