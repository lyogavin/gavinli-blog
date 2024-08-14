import { CMS_NAME } from "@/lib/constants";

export function Intro() {
  return (
    <>
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8">
        Gavin Li's Blog.
        <p className="text-base md:text-xl text-gray-500 mt-6 md:mt-8 tracking-normal font-normal">
          Auther of <a href="https://github.com/airllm/airllm" target="_blank" className="text-blue-900">airllm</a>, 
          ex-Airbnb, ex-Alibaba AI Leader, unicorn AI advisor, entrepreneur.</p>
      </h1>
      <div className="flex flex-col items-center md:items-start mt-10 md:mt-0 md:pl-8">
        <a
          href="https://tally.so/r/mBZb17"
          className="mx-3 bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0"
        >
          Subscribe to Newsletter
        </a>
      </div>
    </section>
    <div className="w-full border-b border-1 border-gray-300 mt-8 mb-16 md:mb-18"></div>
    </>
  );
}
