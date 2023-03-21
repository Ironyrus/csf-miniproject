export interface image {
    height: number;
    html_attributions: string[];
    width: number;
    url: string;
    getUrl(request: PhotoRequest): string;
}

export class PhotoRequest {
    public maxWidth!: number;
    public maxHeight!: number;
}