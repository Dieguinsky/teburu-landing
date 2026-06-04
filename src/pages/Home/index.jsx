import Hero from './sections/Hero'
import Intro from './sections/Intro'
import Services from './sections/Services'
import Studio from './sections/Studio'
import Welcome from './sections/Welcome'
import Artists from './sections/Artists'
import Team from './sections/Team'
import './Home.scss'

export default function Home() {
  return (
    <div className="home-page">
      <Hero />
      <Intro />
      <Services />
      <Studio />
      <Welcome />
      <Artists />
      <Team />
    </div>
  )
}
