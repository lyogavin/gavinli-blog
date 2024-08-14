---
title: "Crazy Challenge: Run Llama 405B on a 8GB VRAM GPU"
excerpt: "I’m taking on the challenge of running the Llama 3.1 405B model on a GPU with only 8GB of VRAM. The Llama 405B model is 820GB! That’s 103 times the capacity of an 8GB VRAM! It clearly doesn’t fit into the 8GB VRAM. So how do we make it work?"
coverImage: "/assets/blog/405b-on-8gb/cover.jpg"
date: "2024-08-01"
author:
  name: Gavin Li
  picture: "/assets/blog/authors/gavinli.jpg"
ogImage:
  url: "/assets/blog/405b-on-8gb/cover.jpg"
---



I’m taking on the challenge of running the Llama 3.1 **405B model** on a GPU with only 8GB of VRAM.

The Llama 405B model is 820GB! That’s **103 times** the capacity of an 8GB VRAM!

![](https://cdn-images-1.medium.com/max/2000/1*EbwTzIsPR60p4fmesR1lbQ.png)

![](https://cdn-images-1.medium.com/max/2000/1*lJmfx9Y-LuVMcNCUK9Nm6Q.gif)

It clearly doesn’t fit into the 8GB VRAM. So how do we make it work?

## 4-bit Quantization

First, we use 4-bit quantization technology to convert 16-bit floating-point numbers to **4-bit**, saving four times the memory.

After quantization, all floating-point numbers will be allocated to one of 16 buckets of the 4 bits. The range of floating-point numbers in deep neural networks extends from **-3.40282347E+38 to 3.40282347E+38**. Can this vast range of floating-point numbers be represented using just 16 buckets?

![](https://cdn-images-1.medium.com/max/2000/1*CYkFRD8tCYi9jrqf35CrQQ.png)

Yes, it can.

The most important thing is to ensure that these parameters are **evenly distributed** across the 16 buckets.

Typically, this is almost impossible to achieve. Uneven distribution would result in significant precision loss.

Fortunately, **the parameters of deep neural networks generally** **follow a normal distribution**. Therefore, a simple transformation can ensure a theoretically uniform distribution.

Of course, following a statistical distribution doesn’t mean there are no **outliers**.

We just need to use some dedicated storage space to specially record these outliers. This is known as **outlier-dependent quantization**.

Extensive experiments have shown that 4-bit quantization almost does not affect the accuracy of large language models. (In some cases, the accuracy is even higher!)

After a round of extensive 4-bit quantization, the size of the Llama 405B model has been reduced to 230GB, bringing us “closer” to loading it on my 8GB GPU.

## Layer-by-Layer Inference

The second magic trick to achieve this challenge is layer-by-layer inference.

In fact, the inference process of transformers only requires loading the model layer by layer. **It’s not necessary to load the entire model into memory all at once**.

![](https://cdn-images-1.medium.com/max/2000/0*S2D6Z1XW_GKob1JN)

The Llama 405B model has 126 layers, an increase of 50% in terms of layers.

![](https://cdn-images-1.medium.com/max/2000/1*NiB2V-l0HvKlPyu65k4LhQ.png)

However, the vector dimension has doubled, and the number of multi-head attention heads has also doubled, so **the number of parameters per layer is roughly four times the original**.

By loading and inferring layer by layer, the maximum VRAM usage is **approximately 5GB**.

**Challenge accomplished!**

Now I can successfully run Llama 405B on my 8GB GPU!

## Open Source Project AirLLM

The gap between various large models in the AI industry is rapidly closing. **The differences in models are becoming less significant.**

More and more companies are willing to adopt open-source models and deploy large models themselves, ensuring they can flexibly control and adjust their models based on business needs.

I am also a strong believer of open source and believe that **the future of AI belongs to open source.**

This method has been shared in my open-source project AirLLM ([https://github.com/lyogavin/airllm](https://github.com/lyogavin/airllm)).

    pip install airllm

You only need a few lines of code:

    from airllm import AutoModel
    
    model = AutoModel.from_pretrained（
        "unsloth/Meta-Llama-3.1-405B-Instruct-bnb-4bit")
    
    input_text = ['What is the capital of United States?',]
    
    input_tokens = model.tokenizer(input_text,
          return_tensors="pt", 
          return_attention_mask=False, 
          truncation=True, 
          max_length=128, 
          padding=False)
    
    generation_output = model.generate(
          input_tokens['input_ids'].cuda(), 
          max_new_tokens=10,
          return_dict_in_generate=True)
    
    output = model.tokenizer.decode(generation_output.sequences[0])
    
    print(output)

**We will continue to follow the latest and coolest AI technologies and continue to share open-source work. Welcome to follow us and stay tuned!**
