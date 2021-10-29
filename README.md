<div id="top"></div>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<br />
<div align="center">
	<h3 align="center">Chop Suey</h3>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

Chop Suey 杂碎 is a stir-fried vegetable dish usually with meat or seafood.

In honor of such wonderful food, this npm package is built to imitate the elegant mixing and matching of its ingredients through the functions in combinatorics and statistics.

This includes:
* Subsets
* Combinations
* Permutations
* Shuffle

<p align="right">(<a href="#top">back to top</a>)</p>

### Installation

```sh
   npm i chopsuey
```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

```js
import ChopSuey from 'ChopSuey';
...
const chopsuey = new Chopsuey(array);

chopsuey.getSubsets();
chopsuey.getSubsets(distinct);

chopsuey.getCombinations(length);
chopsuey.getCombinations(length, distinct);

...
```

```js
import ChopSuey from 'ChopSuey';
...
const subsets = Chopsuey.geSubsets(array);
const permutations = Chopsuey.gePermutations(array);
const shuffledArray = Chopsuey.getShuffled(array);
...
```