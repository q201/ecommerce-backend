'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ecommerce-backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AddressModule.html" data-type="entity-link" >AddressModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AddressModule-5269bd999aa21392784584bfdfc82ddc653ca117ab6a3b951c39d13d7588cef6933bf3935afc078721aaa66648c78172cf9a056377209fcf52e0f06d5b464e0c"' : 'data-bs-target="#xs-controllers-links-module-AddressModule-5269bd999aa21392784584bfdfc82ddc653ca117ab6a3b951c39d13d7588cef6933bf3935afc078721aaa66648c78172cf9a056377209fcf52e0f06d5b464e0c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AddressModule-5269bd999aa21392784584bfdfc82ddc653ca117ab6a3b951c39d13d7588cef6933bf3935afc078721aaa66648c78172cf9a056377209fcf52e0f06d5b464e0c"' :
                                            'id="xs-controllers-links-module-AddressModule-5269bd999aa21392784584bfdfc82ddc653ca117ab6a3b951c39d13d7588cef6933bf3935afc078721aaa66648c78172cf9a056377209fcf52e0f06d5b464e0c"' }>
                                            <li class="link">
                                                <a href="controllers/AddressController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddressController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AddressModule-5269bd999aa21392784584bfdfc82ddc653ca117ab6a3b951c39d13d7588cef6933bf3935afc078721aaa66648c78172cf9a056377209fcf52e0f06d5b464e0c"' : 'data-bs-target="#xs-injectables-links-module-AddressModule-5269bd999aa21392784584bfdfc82ddc653ca117ab6a3b951c39d13d7588cef6933bf3935afc078721aaa66648c78172cf9a056377209fcf52e0f06d5b464e0c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AddressModule-5269bd999aa21392784584bfdfc82ddc653ca117ab6a3b951c39d13d7588cef6933bf3935afc078721aaa66648c78172cf9a056377209fcf52e0f06d5b464e0c"' :
                                        'id="xs-injectables-links-module-AddressModule-5269bd999aa21392784584bfdfc82ddc653ca117ab6a3b951c39d13d7588cef6933bf3935afc078721aaa66648c78172cf9a056377209fcf52e0f06d5b464e0c"' }>
                                        <li class="link">
                                            <a href="injectables/AddressService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddressService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-4b07abc29414cfd50b1c5227c3f479f72949f5b661ab3fc6ccd35ecadb85f9f1636f8e5fdf07b2485ceb2f80979a87bf164f4e67e357148522c4770cb3a8db06"' : 'data-bs-target="#xs-controllers-links-module-AppModule-4b07abc29414cfd50b1c5227c3f479f72949f5b661ab3fc6ccd35ecadb85f9f1636f8e5fdf07b2485ceb2f80979a87bf164f4e67e357148522c4770cb3a8db06"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-4b07abc29414cfd50b1c5227c3f479f72949f5b661ab3fc6ccd35ecadb85f9f1636f8e5fdf07b2485ceb2f80979a87bf164f4e67e357148522c4770cb3a8db06"' :
                                            'id="xs-controllers-links-module-AppModule-4b07abc29414cfd50b1c5227c3f479f72949f5b661ab3fc6ccd35ecadb85f9f1636f8e5fdf07b2485ceb2f80979a87bf164f4e67e357148522c4770cb3a8db06"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-4b07abc29414cfd50b1c5227c3f479f72949f5b661ab3fc6ccd35ecadb85f9f1636f8e5fdf07b2485ceb2f80979a87bf164f4e67e357148522c4770cb3a8db06"' : 'data-bs-target="#xs-injectables-links-module-AppModule-4b07abc29414cfd50b1c5227c3f479f72949f5b661ab3fc6ccd35ecadb85f9f1636f8e5fdf07b2485ceb2f80979a87bf164f4e67e357148522c4770cb3a8db06"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-4b07abc29414cfd50b1c5227c3f479f72949f5b661ab3fc6ccd35ecadb85f9f1636f8e5fdf07b2485ceb2f80979a87bf164f4e67e357148522c4770cb3a8db06"' :
                                        'id="xs-injectables-links-module-AppModule-4b07abc29414cfd50b1c5227c3f479f72949f5b661ab3fc6ccd35ecadb85f9f1636f8e5fdf07b2485ceb2f80979a87bf164f4e67e357148522c4770cb3a8db06"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-f5969e1a2abd7af3b7b38a65a22a55806b0b15765a4c082b3c5cf75b92db90777e7d7ba795e7cf14229791d2c699179344832c0f8d3af812a5ac24a937d95afe"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-f5969e1a2abd7af3b7b38a65a22a55806b0b15765a4c082b3c5cf75b92db90777e7d7ba795e7cf14229791d2c699179344832c0f8d3af812a5ac24a937d95afe"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-f5969e1a2abd7af3b7b38a65a22a55806b0b15765a4c082b3c5cf75b92db90777e7d7ba795e7cf14229791d2c699179344832c0f8d3af812a5ac24a937d95afe"' :
                                            'id="xs-controllers-links-module-AuthModule-f5969e1a2abd7af3b7b38a65a22a55806b0b15765a4c082b3c5cf75b92db90777e7d7ba795e7cf14229791d2c699179344832c0f8d3af812a5ac24a937d95afe"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-f5969e1a2abd7af3b7b38a65a22a55806b0b15765a4c082b3c5cf75b92db90777e7d7ba795e7cf14229791d2c699179344832c0f8d3af812a5ac24a937d95afe"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-f5969e1a2abd7af3b7b38a65a22a55806b0b15765a4c082b3c5cf75b92db90777e7d7ba795e7cf14229791d2c699179344832c0f8d3af812a5ac24a937d95afe"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-f5969e1a2abd7af3b7b38a65a22a55806b0b15765a4c082b3c5cf75b92db90777e7d7ba795e7cf14229791d2c699179344832c0f8d3af812a5ac24a937d95afe"' :
                                        'id="xs-injectables-links-module-AuthModule-f5969e1a2abd7af3b7b38a65a22a55806b0b15765a4c082b3c5cf75b92db90777e7d7ba795e7cf14229791d2c699179344832c0f8d3af812a5ac24a937d95afe"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CartModule.html" data-type="entity-link" >CartModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CartModule-de89e6c60701fd5b5bdb670072352be6880c14d0c6ffd4cc97769a2b26e72a94592bc2a285fd6a61005f963f18582e357d120ab1333e38e78d583d8cd585b18a"' : 'data-bs-target="#xs-controllers-links-module-CartModule-de89e6c60701fd5b5bdb670072352be6880c14d0c6ffd4cc97769a2b26e72a94592bc2a285fd6a61005f963f18582e357d120ab1333e38e78d583d8cd585b18a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CartModule-de89e6c60701fd5b5bdb670072352be6880c14d0c6ffd4cc97769a2b26e72a94592bc2a285fd6a61005f963f18582e357d120ab1333e38e78d583d8cd585b18a"' :
                                            'id="xs-controllers-links-module-CartModule-de89e6c60701fd5b5bdb670072352be6880c14d0c6ffd4cc97769a2b26e72a94592bc2a285fd6a61005f963f18582e357d120ab1333e38e78d583d8cd585b18a"' }>
                                            <li class="link">
                                                <a href="controllers/CartController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CartModule-de89e6c60701fd5b5bdb670072352be6880c14d0c6ffd4cc97769a2b26e72a94592bc2a285fd6a61005f963f18582e357d120ab1333e38e78d583d8cd585b18a"' : 'data-bs-target="#xs-injectables-links-module-CartModule-de89e6c60701fd5b5bdb670072352be6880c14d0c6ffd4cc97769a2b26e72a94592bc2a285fd6a61005f963f18582e357d120ab1333e38e78d583d8cd585b18a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CartModule-de89e6c60701fd5b5bdb670072352be6880c14d0c6ffd4cc97769a2b26e72a94592bc2a285fd6a61005f963f18582e357d120ab1333e38e78d583d8cd585b18a"' :
                                        'id="xs-injectables-links-module-CartModule-de89e6c60701fd5b5bdb670072352be6880c14d0c6ffd4cc97769a2b26e72a94592bc2a285fd6a61005f963f18582e357d120ab1333e38e78d583d8cd585b18a"' }>
                                        <li class="link">
                                            <a href="injectables/CartService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CustomerModule.html" data-type="entity-link" >CustomerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CustomerModule-745b3167a9cfb5640a6508f19637a3e69d834f2a4f904dd3d05d68403a8e13e4eaace4a959476b64b7f43ff6513c37b858be42ed98ac64220bfcff63f2a61d08"' : 'data-bs-target="#xs-controllers-links-module-CustomerModule-745b3167a9cfb5640a6508f19637a3e69d834f2a4f904dd3d05d68403a8e13e4eaace4a959476b64b7f43ff6513c37b858be42ed98ac64220bfcff63f2a61d08"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CustomerModule-745b3167a9cfb5640a6508f19637a3e69d834f2a4f904dd3d05d68403a8e13e4eaace4a959476b64b7f43ff6513c37b858be42ed98ac64220bfcff63f2a61d08"' :
                                            'id="xs-controllers-links-module-CustomerModule-745b3167a9cfb5640a6508f19637a3e69d834f2a4f904dd3d05d68403a8e13e4eaace4a959476b64b7f43ff6513c37b858be42ed98ac64220bfcff63f2a61d08"' }>
                                            <li class="link">
                                                <a href="controllers/CustomerController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomerController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CustomerModule-745b3167a9cfb5640a6508f19637a3e69d834f2a4f904dd3d05d68403a8e13e4eaace4a959476b64b7f43ff6513c37b858be42ed98ac64220bfcff63f2a61d08"' : 'data-bs-target="#xs-injectables-links-module-CustomerModule-745b3167a9cfb5640a6508f19637a3e69d834f2a4f904dd3d05d68403a8e13e4eaace4a959476b64b7f43ff6513c37b858be42ed98ac64220bfcff63f2a61d08"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CustomerModule-745b3167a9cfb5640a6508f19637a3e69d834f2a4f904dd3d05d68403a8e13e4eaace4a959476b64b7f43ff6513c37b858be42ed98ac64220bfcff63f2a61d08"' :
                                        'id="xs-injectables-links-module-CustomerModule-745b3167a9cfb5640a6508f19637a3e69d834f2a4f904dd3d05d68403a8e13e4eaace4a959476b64b7f43ff6513c37b858be42ed98ac64220bfcff63f2a61d08"' }>
                                        <li class="link">
                                            <a href="injectables/CustomerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DiscountModule.html" data-type="entity-link" >DiscountModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-DiscountModule-ed971a103e7e5618c5384e9416718942c3de14efd7e1b175f3d1a3ae640641ecdc4ebd2f6e886655dec633ff52b82b9e7e705d06730186d0dd8845a10b9cc037"' : 'data-bs-target="#xs-controllers-links-module-DiscountModule-ed971a103e7e5618c5384e9416718942c3de14efd7e1b175f3d1a3ae640641ecdc4ebd2f6e886655dec633ff52b82b9e7e705d06730186d0dd8845a10b9cc037"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-DiscountModule-ed971a103e7e5618c5384e9416718942c3de14efd7e1b175f3d1a3ae640641ecdc4ebd2f6e886655dec633ff52b82b9e7e705d06730186d0dd8845a10b9cc037"' :
                                            'id="xs-controllers-links-module-DiscountModule-ed971a103e7e5618c5384e9416718942c3de14efd7e1b175f3d1a3ae640641ecdc4ebd2f6e886655dec633ff52b82b9e7e705d06730186d0dd8845a10b9cc037"' }>
                                            <li class="link">
                                                <a href="controllers/DiscountController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DiscountController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DiscountModule-ed971a103e7e5618c5384e9416718942c3de14efd7e1b175f3d1a3ae640641ecdc4ebd2f6e886655dec633ff52b82b9e7e705d06730186d0dd8845a10b9cc037"' : 'data-bs-target="#xs-injectables-links-module-DiscountModule-ed971a103e7e5618c5384e9416718942c3de14efd7e1b175f3d1a3ae640641ecdc4ebd2f6e886655dec633ff52b82b9e7e705d06730186d0dd8845a10b9cc037"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DiscountModule-ed971a103e7e5618c5384e9416718942c3de14efd7e1b175f3d1a3ae640641ecdc4ebd2f6e886655dec633ff52b82b9e7e705d06730186d0dd8845a10b9cc037"' :
                                        'id="xs-injectables-links-module-DiscountModule-ed971a103e7e5618c5384e9416718942c3de14efd7e1b175f3d1a3ae640641ecdc4ebd2f6e886655dec633ff52b82b9e7e705d06730186d0dd8845a10b9cc037"' }>
                                        <li class="link">
                                            <a href="injectables/DiscountService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DiscountService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FulfillmentModule.html" data-type="entity-link" >FulfillmentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-FulfillmentModule-f335f4f16f09a2688dcff957e7902e328d3c66a4afc7cc1aa914e0d211ce177b91a409f5f4deb18533b565b10b7a4d7511b87920c0b20cb6fc041ca3034df9d4"' : 'data-bs-target="#xs-controllers-links-module-FulfillmentModule-f335f4f16f09a2688dcff957e7902e328d3c66a4afc7cc1aa914e0d211ce177b91a409f5f4deb18533b565b10b7a4d7511b87920c0b20cb6fc041ca3034df9d4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-FulfillmentModule-f335f4f16f09a2688dcff957e7902e328d3c66a4afc7cc1aa914e0d211ce177b91a409f5f4deb18533b565b10b7a4d7511b87920c0b20cb6fc041ca3034df9d4"' :
                                            'id="xs-controllers-links-module-FulfillmentModule-f335f4f16f09a2688dcff957e7902e328d3c66a4afc7cc1aa914e0d211ce177b91a409f5f4deb18533b565b10b7a4d7511b87920c0b20cb6fc041ca3034df9d4"' }>
                                            <li class="link">
                                                <a href="controllers/FulfillmentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FulfillmentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FulfillmentModule-f335f4f16f09a2688dcff957e7902e328d3c66a4afc7cc1aa914e0d211ce177b91a409f5f4deb18533b565b10b7a4d7511b87920c0b20cb6fc041ca3034df9d4"' : 'data-bs-target="#xs-injectables-links-module-FulfillmentModule-f335f4f16f09a2688dcff957e7902e328d3c66a4afc7cc1aa914e0d211ce177b91a409f5f4deb18533b565b10b7a4d7511b87920c0b20cb6fc041ca3034df9d4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FulfillmentModule-f335f4f16f09a2688dcff957e7902e328d3c66a4afc7cc1aa914e0d211ce177b91a409f5f4deb18533b565b10b7a4d7511b87920c0b20cb6fc041ca3034df9d4"' :
                                        'id="xs-injectables-links-module-FulfillmentModule-f335f4f16f09a2688dcff957e7902e328d3c66a4afc7cc1aa914e0d211ce177b91a409f5f4deb18533b565b10b7a4d7511b87920c0b20cb6fc041ca3034df9d4"' }>
                                        <li class="link">
                                            <a href="injectables/FulfillmentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FulfillmentService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OrdersModule.html" data-type="entity-link" >OrdersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-OrdersModule-15236e4541f6557042e63fc136c91c46f0990c0113f046f6b2f6beb570717b941a1938da8219d532a4b1663e0bc97177f2480d7c1619a6735c466f545c07d903"' : 'data-bs-target="#xs-controllers-links-module-OrdersModule-15236e4541f6557042e63fc136c91c46f0990c0113f046f6b2f6beb570717b941a1938da8219d532a4b1663e0bc97177f2480d7c1619a6735c466f545c07d903"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OrdersModule-15236e4541f6557042e63fc136c91c46f0990c0113f046f6b2f6beb570717b941a1938da8219d532a4b1663e0bc97177f2480d7c1619a6735c466f545c07d903"' :
                                            'id="xs-controllers-links-module-OrdersModule-15236e4541f6557042e63fc136c91c46f0990c0113f046f6b2f6beb570717b941a1938da8219d532a4b1663e0bc97177f2480d7c1619a6735c466f545c07d903"' }>
                                            <li class="link">
                                                <a href="controllers/OrdersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrdersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-OrdersModule-15236e4541f6557042e63fc136c91c46f0990c0113f046f6b2f6beb570717b941a1938da8219d532a4b1663e0bc97177f2480d7c1619a6735c466f545c07d903"' : 'data-bs-target="#xs-injectables-links-module-OrdersModule-15236e4541f6557042e63fc136c91c46f0990c0113f046f6b2f6beb570717b941a1938da8219d532a4b1663e0bc97177f2480d7c1619a6735c466f545c07d903"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OrdersModule-15236e4541f6557042e63fc136c91c46f0990c0113f046f6b2f6beb570717b941a1938da8219d532a4b1663e0bc97177f2480d7c1619a6735c466f545c07d903"' :
                                        'id="xs-injectables-links-module-OrdersModule-15236e4541f6557042e63fc136c91c46f0990c0113f046f6b2f6beb570717b941a1938da8219d532a4b1663e0bc97177f2480d7c1619a6735c466f545c07d903"' }>
                                        <li class="link">
                                            <a href="injectables/OrdersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrdersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentModule.html" data-type="entity-link" >PaymentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PaymentModule-e662c83f01bb250bc3552bca9be345abcbf510064259cded62333a5a31619879899dfd4f4a5d121a433e227da33f102c4b241f8763bb49b342cf9c66b9e9f2f9"' : 'data-bs-target="#xs-controllers-links-module-PaymentModule-e662c83f01bb250bc3552bca9be345abcbf510064259cded62333a5a31619879899dfd4f4a5d121a433e227da33f102c4b241f8763bb49b342cf9c66b9e9f2f9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PaymentModule-e662c83f01bb250bc3552bca9be345abcbf510064259cded62333a5a31619879899dfd4f4a5d121a433e227da33f102c4b241f8763bb49b342cf9c66b9e9f2f9"' :
                                            'id="xs-controllers-links-module-PaymentModule-e662c83f01bb250bc3552bca9be345abcbf510064259cded62333a5a31619879899dfd4f4a5d121a433e227da33f102c4b241f8763bb49b342cf9c66b9e9f2f9"' }>
                                            <li class="link">
                                                <a href="controllers/PaymentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PaymentModule-e662c83f01bb250bc3552bca9be345abcbf510064259cded62333a5a31619879899dfd4f4a5d121a433e227da33f102c4b241f8763bb49b342cf9c66b9e9f2f9"' : 'data-bs-target="#xs-injectables-links-module-PaymentModule-e662c83f01bb250bc3552bca9be345abcbf510064259cded62333a5a31619879899dfd4f4a5d121a433e227da33f102c4b241f8763bb49b342cf9c66b9e9f2f9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PaymentModule-e662c83f01bb250bc3552bca9be345abcbf510064259cded62333a5a31619879899dfd4f4a5d121a433e227da33f102c4b241f8763bb49b342cf9c66b9e9f2f9"' :
                                        'id="xs-injectables-links-module-PaymentModule-e662c83f01bb250bc3552bca9be345abcbf510064259cded62333a5a31619879899dfd4f4a5d121a433e227da33f102c4b241f8763bb49b342cf9c66b9e9f2f9"' }>
                                        <li class="link">
                                            <a href="injectables/PaymentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductsModule.html" data-type="entity-link" >ProductsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProductsModule-00bda22c3caf095a15cb489d834ef35dd600bfe8f0baa30f3992a61c4bed67a715ae531e79dee7ba4aed25b8ca4f09c047c4b074085150554a464d86a0108564"' : 'data-bs-target="#xs-controllers-links-module-ProductsModule-00bda22c3caf095a15cb489d834ef35dd600bfe8f0baa30f3992a61c4bed67a715ae531e79dee7ba4aed25b8ca4f09c047c4b074085150554a464d86a0108564"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProductsModule-00bda22c3caf095a15cb489d834ef35dd600bfe8f0baa30f3992a61c4bed67a715ae531e79dee7ba4aed25b8ca4f09c047c4b074085150554a464d86a0108564"' :
                                            'id="xs-controllers-links-module-ProductsModule-00bda22c3caf095a15cb489d834ef35dd600bfe8f0baa30f3992a61c4bed67a715ae531e79dee7ba4aed25b8ca4f09c047c4b074085150554a464d86a0108564"' }>
                                            <li class="link">
                                                <a href="controllers/ProductsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProductsModule-00bda22c3caf095a15cb489d834ef35dd600bfe8f0baa30f3992a61c4bed67a715ae531e79dee7ba4aed25b8ca4f09c047c4b074085150554a464d86a0108564"' : 'data-bs-target="#xs-injectables-links-module-ProductsModule-00bda22c3caf095a15cb489d834ef35dd600bfe8f0baa30f3992a61c4bed67a715ae531e79dee7ba4aed25b8ca4f09c047c4b074085150554a464d86a0108564"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProductsModule-00bda22c3caf095a15cb489d834ef35dd600bfe8f0baa30f3992a61c4bed67a715ae531e79dee7ba4aed25b8ca4f09c047c4b074085150554a464d86a0108564"' :
                                        'id="xs-injectables-links-module-ProductsModule-00bda22c3caf095a15cb489d834ef35dd600bfe8f0baa30f3992a61c4bed67a715ae531e79dee7ba4aed25b8ca4f09c047c4b074085150554a464d86a0108564"' }>
                                        <li class="link">
                                            <a href="injectables/ProductsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-9f4e99c0f52f67ef6cbd040cf97b522182b303b56b40a0c2c39931eeb196f2e2d11b16f87f2ad032306f4cade3f103035582dd12a4ad643f566f07669d45d8bb"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-9f4e99c0f52f67ef6cbd040cf97b522182b303b56b40a0c2c39931eeb196f2e2d11b16f87f2ad032306f4cade3f103035582dd12a4ad643f566f07669d45d8bb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-9f4e99c0f52f67ef6cbd040cf97b522182b303b56b40a0c2c39931eeb196f2e2d11b16f87f2ad032306f4cade3f103035582dd12a4ad643f566f07669d45d8bb"' :
                                            'id="xs-controllers-links-module-UsersModule-9f4e99c0f52f67ef6cbd040cf97b522182b303b56b40a0c2c39931eeb196f2e2d11b16f87f2ad032306f4cade3f103035582dd12a4ad643f566f07669d45d8bb"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-9f4e99c0f52f67ef6cbd040cf97b522182b303b56b40a0c2c39931eeb196f2e2d11b16f87f2ad032306f4cade3f103035582dd12a4ad643f566f07669d45d8bb"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-9f4e99c0f52f67ef6cbd040cf97b522182b303b56b40a0c2c39931eeb196f2e2d11b16f87f2ad032306f4cade3f103035582dd12a4ad643f566f07669d45d8bb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-9f4e99c0f52f67ef6cbd040cf97b522182b303b56b40a0c2c39931eeb196f2e2d11b16f87f2ad032306f4cade3f103035582dd12a4ad643f566f07669d45d8bb"' :
                                        'id="xs-injectables-links-module-UsersModule-9f4e99c0f52f67ef6cbd040cf97b522182b303b56b40a0c2c39931eeb196f2e2d11b16f87f2ad032306f4cade3f103035582dd12a4ad643f566f07669d45d8bb"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Address.html" data-type="entity-link" >Address</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Address-1.html" data-type="entity-link" >Address</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Auth.html" data-type="entity-link" >Auth</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Cart.html" data-type="entity-link" >Cart</a>
                                </li>
                                <li class="link">
                                    <a href="entities/CartItem.html" data-type="entity-link" >CartItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Category.html" data-type="entity-link" >Category</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Customer.html" data-type="entity-link" >Customer</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Discount.html" data-type="entity-link" >Discount</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Fulfillment.html" data-type="entity-link" >Fulfillment</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Order.html" data-type="entity-link" >Order</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OrderAddress.html" data-type="entity-link" >OrderAddress</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OrderItem.html" data-type="entity-link" >OrderItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Payment.html" data-type="entity-link" >Payment</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Product.html" data-type="entity-link" >Product</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProductImage.html" data-type="entity-link" >ProductImage</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Review.html" data-type="entity-link" >Review</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Variant.html" data-type="entity-link" >Variant</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreateAddressDto.html" data-type="entity-link" >CreateAddressDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrderDto.html" data-type="entity-link" >CreateOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrderItemDto.html" data-type="entity-link" >CreateOrderItemDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductDto.html" data-type="entity-link" >CreateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAddressDto.html" data-type="entity-link" >UpdateAddressDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOrderDto.html" data-type="entity-link" >UpdateOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProductDto.html" data-type="entity-link" >UpdateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});