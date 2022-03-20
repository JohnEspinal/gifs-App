import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, GifsServiceResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {


    private apiKey: string = "gLZQGo6k394WT5CrEQIrIx9nJ07R9HIm";
    private baseUrl: string = 'https://api.giphy.com/v1/gifs'
    private _historial: string[] = [];
    
    //TODO: Cambiar any por tipo
    public resultados: Gif[] = [];

    get historial(){
      return [...this._historial];
    }



    constructor(private http: HttpClient) {

      if(localStorage.getItem('historial')){
        this._historial = JSON.parse( localStorage.getItem('historial')! ) || [];

      }

      if(localStorage.getItem('ultimoResultado')){
        const lastResult: string = JSON.parse( localStorage.getItem('ultimoResultado')! ) || [];

        this.buscarGifs(lastResult);

      }

    }

    buscarGifs(query: string = ''){
      
      if( !this._historial.includes(query) ){

        query = query.trim().toLocaleLowerCase();
        this._historial.unshift(query);
        this._historial = this._historial.splice(0,9);

        localStorage.setItem('historial', JSON.stringify(this._historial));
        localStorage.setItem('ultimoResultado', JSON.stringify(query));
      }

      const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit', '10')
        .set('q', query)
        
        

      this.http.get<GifsServiceResponse>(`${this.baseUrl}/search`, {params})
            .subscribe( ( resp: GifsServiceResponse ) => {
              this.resultados = resp.data;
            })

      // fetch("https://api.giphy.com/v1/gifs/search?api_key=gLZQGo6k394WT5CrEQIrIx9nJ07R9HIm&q=Luffy")
      //   .then(resp => {
      //     resp.json().then(data =>{
      //       console.log(data);
      //     })
      //   })

      

    }

}
