import { LitElement, html, property, customElement, query } from '@polymer/lit-element'

const isInters = ({isIntersecting}:IntersectionObserverEntry) => isIntersecting

@customElement('lazy-image' as any)
export class LazyImage extends LitElement {
  
  @property() load = false
  
  @property() src = ''

  constructor(){
    super()
    new IntersectionObserver((entries, observer)=>{
      if(entries.some(isInters)){
        this.load = true
        observer.unobserve(this)
      }
    }).observe(this)
  }

  render() {
    return html`<img src="${this.load ? this.src : ''}">`
  }
  
}

@customElement('infinite-scroll' as any)
export class InfiniteScroll extends LitElement {
  
  @property({ type: { fromAttribute: (attr:string) => JSON.parse(attr) } })
  items: string[] = []
  
  @query('button') next?: HTMLButtonElement
  
  firstUpdated() {
    new IntersectionObserver( entries =>{
      if(entries.some(isInters)){
        this.items = [...this.items, ...this.items]
      }
    }).observe(this.next!)
  }
  
  render() {
    return html`
      <style>lazy-image { display: block; width: 100%; height: 480px; }</style>
      ${this.items.map(i=>html`<lazy-image src="${i}"></lazy-image>`)}
      <button>next</button>
    `
  }

}
