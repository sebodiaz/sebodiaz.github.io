const publicationsData = [
  {
    imageSrc: './images/publications/pose_diaz_review_2025.png',
    caption: 'Qualtitative results. Pictured are challenging, lower GA subjects. Noticeably, our method significantly improves the pose estimation.',
    title: 'Robust Fetal Pose Estimation across Gestational Ages via Cross-Population Augmentation',
    status: 'In Review.',
    authors: '<strong>Sebo Diaz</strong>, Benjamin Billot, Neel Dey, Molin Zhang, Esra Abaci-Turk, Ellen Grant, Polina Golland, Elfar Adalsteinsson',
    description: 'Current fetal pose estimation methods fail to generalize across gestational ages (GA). We propose a novel method to capture lower GA subjects using exclusively higher GA subjects. We achieve state-of-the-art performance on a challenging clinical dataset enabling more accurate motion estimation.',
    buttons: [
      { text: 'arXiv [Soon]', link: '#', disabled: true },
      { text: 'Code [Soon]', link: '#', disabled: true }
    ]
  },
  {
    imageSrc: './images/publications/slfrank_diaz_ismrm_2024.png',
    caption: 'Images are in-utero fetal brain acquisitions. (Top) Gold standard HASTE (TSE) pulse design image, SAR limits (red) are hit. (Bottom) SLfRank pulse design image. SAR limits are not hit and reduced by 22%.',
    title: 'Design of Novel RF Pulse for Fetal MRI Refocusing Trains using Rank Factorization (SLfRank) to Reduce SAR and Improve Image Acquisition Efficiency',
    status: 'ISMRM 2022.',
    authors: '<strong>Sebo Diaz</strong>, Yamin Arefeen, Borjan Gagoski, Ellen Grant, Elfar Adalsteinsson',
    description: 'Relaxed optimization problem enables significant image acceleration. We show <em>22%</em> acceleration compared to industry standard with no tradeoffs. Applications in fetal, but pertains to any turbo spin echo sequence.',
    buttons: [
      { text: 'ISMRM Proceedings', link: 'https://archive.ismrm.org/2022/2926.html' }
    ]
  },
  {
    imageSrc: 'https://via.placeholder.com/600x400',
    caption: 'Fetuses Made Simple: Modeling and Tracking of Fetal Shape and Pose',
    title: 'Fetuses Made Simple: Modeling and Tracking of Fetal Shape and Pose',
    status: 'MICCAI 2025.',
    authors: 'Yingcheng Liu, Peiqi Wang, <strong>Sebo Diaz</strong>, Benjamin Billot, Esra Abaci Turk, Ellen Grant, Polina Golland',
    description: '',
    buttons: []
  },
  {
    imageSrc: './images/publications/stochastic_offset_ismrm_2024.png',
    caption: 'Stochastic-offset-strategy enhanced RF pulse optimization with auto-differentiation',
    title: 'Stochastic-offset-strategy enhanced RF pulse optimization with auto-differentiation',
    status: 'ISMRM 2024.',
    authors: 'Molin Zhang, Nicholas Arango, <strong>Sebo Diaz</strong>, Jacob White, Elfar Adalsteinsson',
    description: 'Voxel-wise objective function with auto-differentiation for RF pulse optimization has become prevalent. While benefit from the spatial flexibility of desired pattern, conventional fixed-point representation of a matrix fed into the voxel-wise objective function leads to sub-optimal and undesired resultant profile at courser resolution. We assign random spatial offsets to each point centered at the voxel and show superior performance to fixed-point representations.',
    buttons: [
      { text: 'ISMRM Proceedings', link: 'https://submissions.mirasmart.com/ISMRM2024/Itinerary/PresentationDetail.aspx?evdid=5606' }
    ]
  }
];


document.addEventListener('DOMContentLoaded', function() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeButton = document.querySelector('.close-button');

  const publicationsContainer = document.getElementById('publications-container');

  publicationsData.forEach(pub => {
    const pubColumn = document.createElement('div');
    pubColumn.className = 'columns is-vcentered mb-5';

    let buttonsHtml = '';
    if (pub.buttons && pub.buttons.length > 0) {
      buttonsHtml = '<div class="buttons mt-2">';
      pub.buttons.forEach(button => {
        const disabledAttr = button.disabled ? 'disabled' : '';
        const hrefAttr = button.link ? `href="${button.link}"` : 'href="#"';
        const targetAttr = button.link && !button.link.startsWith('#') ? 'target="_blank"' : ''; // Open external links in new tab
        buttonsHtml += `<a class="button is-small is-light" ${hrefAttr} ${targetAttr} ${disabledAttr}>${button.text}</a>`;
      });
      buttonsHtml += '</div>';
    }

    // Add click-hint for images
   //  const clickHintHtml = '<div class="click-hint">Click to enlarge</div>';

    pubColumn.innerHTML = `
      <div class="column is-one-third">
        <a href="#" class="image-lightbox-trigger" data-src="${pub.imageSrc}" data-caption="${pub.caption}">
          <figure class="image">
            <img src="${pub.imageSrc}" alt="Publication Visual">
          </figure>
        </a>
      </div>
      <div class="column">
        <p class="is-size-6 has-text-weight-semibold">
          ${pub.title}
        </p>
        <p>${pub.status}</p>
        <p class="vspace">${pub.authors}</p>
        ${pub.description ? `<p>${pub.description}</p>` : ''}
        ${buttonsHtml}
      </div>
    `;

    publicationsContainer.appendChild(pubColumn);
  });


  // IMPORTANT: Re-select imageTriggers AFTER publications are added to the DOM
  // This is crucial because the initial imageTriggers query would run before these
  // elements existed.
  const newImageTriggers = document.querySelectorAll('.image-lightbox-trigger');

  newImageTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(event) {
      event.preventDefault();
      const imgSrc = this.getAttribute('data-src');
      const imgCaption = this.getAttribute('data-caption');

      lightbox.classList.add('is-active');
      lightboxImg.src = imgSrc;
      lightboxCaption.innerHTML = imgCaption;
      document.body.style.overflow = 'hidden';
    });
  });

  closeButton.addEventListener('click', function() {
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
  });

  lightbox.addEventListener('click', function(event) {
    if (event.target === lightbox) {
      lightbox.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === "Escape" && lightbox.classList.contains('is-active')) {
      lightbox.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  });
});