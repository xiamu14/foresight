const emptyCode =
  'var Component=(()=>{var m=Object.create;var a=Object.defineProperty;var u=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var d=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var j=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),p=(t,e)=>{for(var n in e)a(t,n,{get:e[n],enumerable:!0})},r=(t,e,n,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let c of x(e))!f.call(t,c)&&c!==n&&a(t,c,{get:()=>e[c],enumerable:!(o=u(e,c))||o.enumerable});return t};var v=(t,e,n)=>(n=t!=null?m(d(t)):{},r(e||!t||!t.__esModule?a(n,"default",{value:t,enumerable:!0}):n,t)),_=t=>r(a({},"__esModule",{value:!0}),t);var i=j((w,l)=>{l.exports=_jsx_runtime});var g={};p(g,{default:()=>b,frontmatter:()=>D});var s=v(i()),D={title:"test",date:new Date(16626816e5)};function M(t={}){let{wrapper:e}=t.components||{};return e?(0,s.jsx)(e,Object.assign({},t,{children:(0,s.jsx)(n,{})})):n();function n(){let o=Object.assign({nav:"nav",ol:"ol"},t.components);return(0,s.jsx)(o.nav,{className:"toc",children:(0,s.jsx)(o.ol,{className:"toc-level toc-level-1"})})}}var b=M;return _(g);})();\n;return Component;';

export default emptyCode;
