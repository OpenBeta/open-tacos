import React from 'react'
import Layout from '../components/layout'
import SeoTags from '../components/SeoTags'

const siteName: string = 'address of your website, e.g. example.com'

const personHost: string = 'name of the person or company behind your website, e.g. "John Doe, resident of California" or "SomeCo, Inc., a New York corporation"'

const addressState: string = 'e.g. "California"'

const USState: string = 'e.g. "San Francisco, California"'

const contactNum: string = 'e.g. "privacy@example.com"'

const dateLast: string = 'e.g. January 1, 2020'

function Tos (): JSX.Element {
  return (
    <Layout contentContainerClass='content-default with-standard-y-margin'>
      <SeoTags
        keywords={['openbeta', 'rock climbing', 'climbing api']}
        description='Climbing route wiki' title='Terms of Service'
      />
      <section className='flex md:justify-center pb-12'>
        <div className='max-w-prose space-y-14 px-4 sm:px-6 lg:px-8'>
          {/* START HEADER CONTENT */}
          <div className='space-y-4'>
            <h2>
              The Turnstile Terms of Service at https://turnstiletos.com/1e1c govern use of this website. To use this website, you must agree to those terms.
            </h2>
            <p>The website is {siteName}.</p>
            <p>The operator is {personHost}.</p>
            <p>The governing law is {addressState}.</p>
            <p> The forum for disputes is {USState}.</p>
            <p>The operator’s contact information is {contactNum}.</p>
            <p>These terms were last updated on {dateLast}.</p>
          </div>
          {/* END HEADER CONTENT */}
          {/* START CONTENT  */}
          <div className='space-y-8'>
            <div className='space-y-4'>
              <h2>Turnstile Terms of Service</h2>
              <p>First Edition, First Correction, January 8, 2021</p>
              <p>Permalink: <a href='https://turnstiletos.com/1e1c'> https://turnstiletos.com/1e1c</a>
              </p>
            </div>
            <div className='space-y-4'>
              <h3 className='font-medium'>Scope</h3>
              <p>These terms govern use of the website. The operator of the website may offer other products and services. These terms apply only to use of the website.
              </p>
            </div>
            <div className='space-y-4'>
              <h3 id='important' className='font-medium'>Important Terms</h3>
              <p>These terms include a number of especially important provisions that affect your rights and responsibilities, such as the disclaimers in
                <a href='#disclaimers' className='text-blue-600'> Disclaimers</a>, limits on the operator’s legal liability to you in <a href='#limits' className='text-blue-600'> Limits on Liability </a> your agreement to reimburse the operator for problems caused by your misuse of the website in <a href='#responsibility' className='text-blue-600'> Your Responsibility</a>, and an agreement about how to resolve disputes in <a className='text-blue-600' href='#disputes'> Disputes</a>.
              </p>
            </div>
            <div className='space-y-4'>
              <h3 className='font-medium'>Your Permission to Use the Website
              </h3>
              <p>Subject to these terms, the operator gives you permission to use the website. You can’t transfer your permission to anyone else. Others need to agree to these terms for themselves to use the website.</p>
            </div>
            <div className='space-y-4'>
              <h3 className='font-medium'>Conditions for Use of the Website</h3>
              <p>Your permission to use the website is subject to the following conditions:</p>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>You must be at least thirteen years old.</li>
                <li>You must be at least thirteen years old. You may no longer use the website if the operator tells you that you may not.</li>
                <li>You must follow <a className='text-blue-600' href='#acceptable'>Acceptable Use</a>  and <a href='#content' className='text-blue-600'>Content Standards.</a></li>
              </ol>
            </div>
            <div className='space-y-4'>
              <h3 className='font-medium'>Acceptable Use</h3>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>You may not break the law using the website.</li>
                <li>You may not use or try to use anyone else’s account on the website without their specific permission.</li>
                <li>You may not buy, sell, or otherwise trade in addresses, user names, or other unique identifiers on the website.</li>
                <li>You may not send advertisements, chain letters, or other solicitations through the website, or use the website to gather addresses for distribution lists.</li>
                <li>You may not automate access to the website, or monitor the website, such as with a web crawler, browser plug-in or add-on, or other computer program that is not a web browser. You may crawl the website to index it for a publicly available search engine, so long as you abide by the rules of any robots.txt file on the website.</li>
                <li>You may not use the website to send e-mail to distribution lists, newsgroups, or group mail aliases.</li>
                <li>You may not falsely imply that you’re affiliated with or endorsed by the operator.</li>
                <li>You may not hyperlink to images or other non-hypertext content on the website.</li>
                <li>You may not show any part of the website on other websites with iframes or similar methods.</li>
                <li>You may not remove any marks showing proprietary ownership from materials you download from the website.</li>
                <li>You may not disable, avoid, or circumvent any security or access restrictions of the website.</li>
                <li>You may not strain infrastructure of the website with an unreasonable volume of requests, or requests designed to impose an unreasonable load on information systems the operator uses to provide the website.</li>
                <li>You may not impersonate others through the website.</li>
                <li>You may not encourage or help anyone in violation of these terms.</li>
              </ol>
            </div>
            <div className='space-y-4'>
              <h3 id='content' className='font-medium'>Content Standards</h3>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>You may not submit content to the website that is illegal, offensive, or otherwise harmful to others. This includes content that is harassing, inappropriate, or abusive.</li>
                <li>You may not submit content to the website that violates the law, infringes anyone’s intellectual property rights, violates anyone’s privacy, or breaches agreements you have with others.</li>
                <li>You may not submit content to the website containing malicious computer code, such as computer viruses or spyware.</li>
                <li>You may not submit content to the website as a mere placeholder to hold a particular address, user name, or other unique identifier.</li>
                <li>You may not use the website to disclose information from or about others that you don’t have the right to disclose.</li>
              </ol>
            </div>
            <div className='space-y-4'>
              <h3 className='font-medium'>Enforcement</h3>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>The operator may investigate and prosecute violations of these terms to the fullest legal extent. The operator may notify and cooperate with law enforcement authorities in prosecuting violations of the law and these terms.</li>
                <li>
                  The operator reserves the right to change, redact, and delete content on the website for any reason. If you believe someone has submitted content to the website in violation of these terms, contact the operator immediately. <a href='#contact' className='text-blue-600'>See Contact</a>.
                </li>
              </ol>
            </div>
            <div className='space-y-4'>
              <h3 className='font-medium'>Your Account</h3>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>You must create and log into an account to use some features of the website.</li>
                <li>To create an account, you must provide some information about yourself. If you create an account, you agree to provide, at a minimum, a valid e-mail address, and to keep that address up-to-date. You may close your account at any time.</li>
                <li>You agree to be responsible for everything done with your account, whether authorized by you or not, until you either close your account or notify the operator that your account has been compromised. You agree to notify the operator immediately if you suspect your account has been compromised. You agree to select a secure password for your account, and keep it secret.</li>
                <li>The operator may restrict, suspend, or close your account on the website according to its policy for handling copyright-related takedown requests, or if the operator reasonably believes that you’ve breached these terms.</li>
              </ol>
            </div>
            <div className='space-y-4'>
              <h3 className='font-medium'>Your Content</h3>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>Nothing in these terms gives the operator any ownership rights in content or intellectual property that you share with the website, such as your account information and content you submit to the website. Nothing in these terms gives you any ownership rights in the operator’s content or intellectual property, either.</li>
                <li>Between you and the operator, you remain solely responsible for content you submit to the website. You agree not to wrongly imply that content you submit to the website is from, sponsored by, or approved by the operator. These terms do not obligate the operator to store, maintain, or provide copies of content you submit.</li>
                <li>Content you submit to the website belongs to you, and you decide how to license it to others. But at a minimum, you license the operator to provide content that you submit to the website to other users of the website. That special license allows the operator to copy, publish, and analyze content you submit to the website.</li>
                <li>When content you submit is removed from the website, whether by you or by the operator, the operator’s special license ends when the last copy disappears from the operator’s backups, caches, and other systems. Other licenses you give for your content may continue after your content is removed. Those licenses may give others, or the operator itself, the right to share your content through the website again.</li>
                <li>Others who receive content you submit to the website may violate the terms on which you license your content. You agree that the operator will not be liable to you for those violations or their consequences.</li>
              </ol>
            </div>
            <div className='space-y-4'>
              <h3 id='responsibility' className='font-medium'>Your Responsibility</h3>
              <p>You agree to reimburse the operator for all the costs of legal claims by others related to your breach of these terms, or breach of these terms by others using your account. Both you and the operator agree to notify the other side of any legal claims you might have to reimburse the operator for as soon as possible. If the operator fails to notify you of a legal claim promptly, you won’t have to reimburse the operator for costs that you could have defended against or lessened with prompt notice. You agree to allow the operator to take over investigation, defense, and settlement of legal claims you would have to reimburse the operator for, and to cooperate with those efforts. The operator agrees not to enter any settlement that admits you were at fault or requires you to do anything without your permission.</p>
            </div>
            <div className='space-y-4'>
              <h3 id='disclaimers' className='font-medium'>Disclaimers</h3>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>You accept all risk of using the website and it content. As far as the law allows, the operator provides the website and its content as is, without any warranty whatsoever.</li>
                <li>The website may hyperlink to and integrate websites and services run by others. The operator does not make any warranty about services run by others, or content they may provide. Use of services run by others may be governed by other terms between you and the one running service.</li>
              </ol>
            </div>
            <div className='space-y-4'>
              <h3 id='limits' className='font-medium'>Limits on Liability</h3>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>The operator will not be liable to you for breach-of-contract damages operator personnel could not have reasonably foreseen when you agreed to these terms.</li>
                <li>As far as the law allows, the operator’s total liability to you for claims of any kind that are related to the website or its content will be limited to $50.</li>
              </ol>
            </div>
            <div className='space-y-4'>
              <h3 id='feedback' className='font-medium'>Feedback</h3>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>The operator welcomes your feedback and suggestions for the website. <a className='text-blue-600' href='#contact'>See Contact</a>.</li>
                <li>You agree that the operator will be free to act on feedback and suggestions you provide, and that the operator won’t have to notify you that your feedback was used, get your permission to use it, or pay you for it. You agree not to submit feedback or suggestions that you believe might be confidential or proprietary, to you or others.</li>
              </ol>
            </div>
            <div className='space-y-4'>
              <h3 id='Termination' className='font-medium'>Termination</h3>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>Either you or the operator may end this agreement at any time. When this agreement ends, your permission to use the website also ends.</li>
                <li>The following sections continue after this agreement ends: <a className='text-blue-600' href='#content'>Your Content</a>, <a className='text-blue-600' href='#feedback'>Feedback</a> , <a className='text-blue-600' href='#responsibility'>Your Responsibility</a>, <a href='#disclaimers' className='text-blue-600'>Disclaimers</a>, <a href='#limits' className='text-blue-600'>Limits on Liability</a>, and <a className='text-blue-600' href='#general'>General Terms</a>.</li>
              </ol>
            </div>
            <div className='space-y-4'>
              <h3 id='disputes' className='font-medium'>Disputes</h3>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>The governing law will govern these terms and all legal proceedings related to these terms or your use of the website. If the operator doesn’t say what the governing law is, it’s the law under which the operator’s legal entity is formed. If the operator doesn’t have a legal entity, it’s the law of the state where the operator is based.</li>
                <li>Both sides agree to bring legal any proceedings related to this agreement only in the national and any national-subdivision courts located in the forum for disputes. If the operator doesn’t say what the forum for disputes is, it’s the city with state and federal courts in the state of the governing law that is closest to where the operator is based. If the operator isn’t based in that state, the forum for disputes is the capital of that state.</li>
                <li>Neither you nor the operator will object to jurisdiction, forum, or venue in those courts.</li>
                <li>If the governing law allows, both sides waive their rights to trial by jury.</li>
                <li>Both sides agree to bring any legal claims related to this agreement as individuals, not as part of a class action or other representative proceeding.</li>
              </ol>
            </div>
            <div className='space-y-4'>
              <h3 id='general' className='font-medium'>General Terms</h3>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>If a section of these terms is unenforceable as written, but could be changed to make it enforceable, that section should be changed to the minimum extent necessary to make it enforceable. Otherwise, that section should be removed, and the others should be enforced as written.</li>
                <li>You may not assign this agreement. The operator may assign this agreement to any affiliate of the operator, any other company that obtains control of the operator, or any other company that buys assets of the operator related to the website. Any attempt to assign against these terms has no legal effect.</li>
                <li>Neither the exercise of any right under this agreement, nor waiver of any breach of this agreement, waives any other breach of this agreement.</li>
                <li>These terms, plus the terms on any page incorporating them by reference, are all the terms of agreement between you and the operator about use of the website. This agreement entirely replaces any other agreements about your use of the website, written or not.</li>
              </ol>
            </div>
            <div className='space-y-4'>
              <h3 id='contact' className='font-medium'>Contact</h3>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>You may notify the operator under these terms, and send questions to the operator, using the contact information they provide.</li>
                <li>The operator may notify you under these terms using the e-mail address you provide for your account on the website, or by posting a message to the homepage of the website or your account page.</li>
              </ol>
            </div>
            <div className='space-y-4'>
              <h3 id='changes' className='font-medium'>Changes</h3>
              <ol className='list-decimal mx-8 space-y-2'>
                <li>The operator may update the terms of service for the website. The operator will post all updates to the website. For updates with substantial changes, the operator agrees to e-mail you if you’ve created an account and provided a valid e-mail address. The operator may also announce updates with special messages or alerts on the website.</li>
                <li>Once you get notice of an update to these terms, you must agree to the new terms in order to keep using the website.</li>
              </ol>
            </div>
          </div>
          {/* END CONTENT */}
        </div>
      </section>
    </Layout>
  )
}

export default Tos
