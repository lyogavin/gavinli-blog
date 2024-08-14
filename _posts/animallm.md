---
title: "Exciting update!! Announcing new Anima LLM model, 100k context window!! Fully open source!"
excerpt: "We believe the future of AI will be fully open and democratized. AI should be a tool that’s accessible to everyone, instead of only the big monopolies(some of them have the term “open” in their names 😆 .). QLoRA might be an important step towards that future. We want to make some small contribution to the historical process of democratization of AI, we are open sourcing the 33B QLoRA model we trained: all the model parameters, code, datasets and evaluations are opened!"
coverImage: "/assets/blog/animallm/cover.png"
date: "2023-09-23"
author:
  name: Gavin Li
  picture: "/assets/blog/authors/gavinli.jpg"
ogImage:
  url: "/assets/blog/animallm/cover.png"
---



We believe the future of AI will be fully open and democratized. AI should be a tool that’s accessible to everyone, instead of only the big monopolies(some of them have the term “open” in their names 😆 .). QLoRA might be an important step towards that future. We want to make some small contribution to the historical process of democratization of AI, we are open sourcing the 33B QLoRA model we trained: all the model parameters, code, datasets and evaluations are opened! 🤗

## **1. QLoRA is a Game Changer**

Previously, most open-source finetuneable models were relatively small, such as 7B or 13B models. Although they can perform well on some simple chatbot evaluation datasets through finetuning, their reasoning abilities are still relatively weak due to the limited scale of these models. This is why many small-scale models perform like toys in real-world applications. The gap between small models and large models is quite apparent in complex logic reasoning and mathematical problems that truly test the capabilities of the model.

![QLoRA is the game changer](https://cdn-images-1.medium.com/max/3840/1*oGiSGcyryflQaGUuSAnKSA.png)

Therefore, we believe that the work on QLoRA is very important and could be a **game changer** and a **turning point** in the wave of AI technology innovation. The high cost of training Transformer-based language models is mainly due to the memory requirements in the backward gradient descent optimization process, which can be up to 16 times the size of the model parameters! For example, a 65B model requires 780GB of GPU memory, equivalent to needing 20 top-tier A100 GPUs to hold it (excuse me!)!

QLoRA proposes many optimizations based on the previous LORA technology:

* **4-bit NormalFloat** technology, which compresses the storage of a Float data from 16 bits to only 4 bits, with almost no loss of precision.

* **Double Quantization** technology, which further reduces the extra memory occupied by 4-bit quantization.

* **Paged Optimizers**, which can quickly move overflow data to CPU memory in case of insufficient memory and prevent training failure due to memory overflow.

In simple terms, it drastically reduces memory consumption — from 780GB in the past to only 48GB now!

QLoRA’s optimization methods have, for the first time, enabled 33B-scale models to be finetuned in a more affordable and democratic manner, making the widespread use of 33B models possible for the first time. We believe that 33B models can not only leverage the stronger reasoning capabilities of large-scale models, but also enable flexible finetuning using proprietary domain data to enhance control over LLMs.

## 2. Open Sourcing the first Chinese QLoRA 33B model: Anima

QLoRA paper authors open sourced the 33B model optimized for chatbot use cases: **Guanaco **which reportedly outperform GPT3!

**Guanaco** is mainly optimized for English. The performance on other languages still varies. What should we do if we want to use it for other languages?

All we need is some finetune training on the training set of the target language. We finetuned a new Chinese 33B model we call Anima. We are open sourcing the model in hugging face: [here](https://huggingface.co/lyogavin/Anima33B). All the source code, evaluations and more details could be found in [github repo](https://github.com/lyogavin/Anima). The process could be used for other languages similarly.

Our training and experiments show that the fundermental reasoning capability already exists in the Guanaco model, so we don’t need too big training dataset. We just need some training to get the model ready and familiar with the target language we need.

![Open source 33B QLoRA Chinese Modle Anima](https://cdn-images-1.medium.com/max/2000/0*YMdrPJ7bxag8RIEC)

## 3. How is Anima Model trained?

Anima model is trained based on QLoRA’s [33B guanaco](https://huggingface.co/timdettmers/guanaco-33b). It’s finetuned for 10000 steps with one H100 GPU。

### Training dataset

We mainly use the Chinese training dataset put together by project [Chinese-Vicuna](https://github.com/Facico/Chinese-Vicuna): [guanaco_belle_merge_v1.0](https://huggingface.co/datasets/Chinese-Vicuna/guanaco_belle_merge_v1.0) in our finetune training work.

* **Rationale**: According to the conclusions in [QLoRA](https://arxiv.org/abs/2305.14314) [Appendix](https://arxiv.org/abs/2305.14314)Appendix) B.4 and Table 9’s Grid Search: For QLoRA fine-tuning, a larger number of training samples is not necessarily better. 10,000 steps is a size with a relatively good ROI. Therefore, we want to choose a dataset with no less than 10,000 steps. There are a few open datasets we could choose, the [Belle 10M](https://github.com/LianjiaTech/BELLE/blob/main/data/10M) dataset seems too big, and the data quality is unclear to us. Due to limited time, we end up with the [guanaco_belle_merge_v1.0](https://huggingface.co/datasets/Chinese-Vicuna/guanaco_belle_merge_v1.0) dataset. Later, we will further test more datasets and the effects of data quality filtering in a more systematic way.

### Hyper-parameters

For cost considerations, we mostly chose not to do too much grid search, assuming the conclusions from the comprehensive hyper-parameters grid search experiments in [QLoRA paper](https://arxiv.org/abs/2305.14314) also applies in our case:

* Batch size: 16 ([QLoRA](https://arxiv.org/abs/2305.14314) Appendix B.4 and Table 9)

* Max steps: 10000 ([QLoRA](https://arxiv.org/abs/2305.14314) Appendix B.4 and Table 9)，more steps in bigger dataset are being experimented, will keep reporting our new findings.

* Learning rate: 1e-4 ([QLoRA](https://arxiv.org/abs/2305.14314) Appendix B.4 and Table 9)

* LoRA r=64, alpha=16 ([QLoRA](https://arxiv.org/abs/2305.14314) Appendix B.2)

* source_max_len=512, target_max_len=512，it’s important to make sure most of the information in training dataset are kept complete without being truncated. We used this [script](https://github.com/lyogavin/Anima/blob/main/scripts/test_cn_dataset_lenghts.py) to check the token lengths distributions. Conclusion is 512 seems to be a good choice.

### How to reproduce our training

Anima 33B model could be reproduced fully with the following steps(tested on single GPU environment of 1x80GB H100, or multi-GPU of 2xA100 40GB)：

    # 1. install dependencies
    pip install -r requirements.txt
    # 2. 
    cd training
    ./run_Amina_training.sh

### Multi-GPU training

Because of Hugging Face Accelerate，multi-GPU training is supported out-of-box.

We tested 2xA100 40GB, the above script can work directly seamlessly.

## 4. Evaluations

### Elo rating tournament

 <iframe src="https://medium.com/media/585eacf85c4f8c707a0116b09472d6f2" frameborder=0></iframe>

### Evaluation Methodology

* Evaluation Dataset：As discussed in [Belle Paper](https://github.com/LianjiaTech/BELLE/blob/main/docs/Towards%20Better%20Instruction%20Following%20Language%20Models%20for%20Chinese.pdf), the different types of distribution in the evaluation set have a huge impact on the evaluation results. The final result is more a reflection of the ratios between different domains in the dataset. Therefore, we chose the widely recognized [Vicuna benchmark](https://lmsys.org/blog/2023-03-30-vicuna/) in English chatbot model research. To evaluate Chinese, we used GPT4 to translate the questions.

* Evaluation Approach：In order to balance the cost, we mainly use GPT4 for evaluation. As argued in [QLoRA](https://arxiv.org/abs/2305.14314), the pure GPT4 scoring model comparison has a large random fluctuation. This is consistent with our observations. Therefore, we adopted the Elo Rating tournament evaluation method recommended by [QLoRA](https://arxiv.org/abs/2305.14314),, which is now widely used.

* Hyper-parameters Selection: Due to cost considerations, we choose: 300 rounds of random evaluation, randomly selecting the order of models to offset the impact of the order, with a random seed of 42. The implementation code of Elo rating and other hyperparameters follows [Vicuna’s Elo code](https://raw.githubusercontent.com/lm-sys/FastChat/833d65032a715240a3978f4a8f08e7a496c83cb1/fastchat/serve/monitor/elo_analysis.py): K=32, initial rating=1000.

### Elo rating tournament

The Elo rating source code could be found here:

![](https://cdn-images-1.medium.com/max/2000/0*9HBA_mSZqsyPoEAR)

## 5. Conclusion

The most important capability of the modern LLM models are their logical reasoning ability and their ability to encode knowledge for building successful practical applications. Therefore, the scale of the model can be crucial. Through the QLoRA method, we can fine-tune and optimize the largest model for a given hardware condition at a sufficiently low cost, thereby achieving the best results.

The Anima model has achieved the optimal performance for a Chinese model with only 10,000 steps of training, without deeply optimizing the quality of the training data.

You can find more details in the [github repo](https://github.com/lyogavin/Anima). If you have any questions or suggestions, please feel free to drop comments below or reach out to us!
